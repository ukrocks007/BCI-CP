/**
 * Linear Discriminant Analysis (LDA) Classifier
 * 
 * Paper Reference: LDA is a classical method for BCI classification.
 * This is a FULL IMPLEMENTATION with no external ML libraries.
 * 
 * Theory:
 * LDA finds the linear combination of features that best separates two classes.
 * It assumes Gaussian distributions with equal covariance matrices.
 * 
 * Decision Rule:
 * For features x, predict YES if: w^T * x + b > threshold
 *                    predict NO  otherwise
 * 
 * where w is the LDA weight vector and b is the bias term.
 */

import { FeatureVector, ClassificationResult } from '../types/index.js';

interface TrainingData {
  features: FeatureVector[];
  labels: string[];
}

/**
 * LDA Classifier implementation
 * Stores learned parameters and makes predictions
 */
export class LDAClassifier {
  private weights: number[] = [0, 0, 0]; // For [mean, peak, latency]
  private bias: number = 0;
  private isTrained: boolean = false;
  private threshold: number = 0.5; // Confidence threshold for YES classification

  /**
   * Trains LDA on labeled data
   * 
   * Algorithm:
   * 1. Calculate class means for each class
   * 2. Calculate pooled covariance matrix
   * 3. Calculate weight vector w = Σ_inv * (mean_yes - mean_no)
   * 4. Calculate bias term
   * 
   * @param data - Training data with features and labels
   */
  public train(data: TrainingData): void {
    const { features, labels } = data;

    if (features.length === 0 || labels.length !== features.length) {
      console.warn('Invalid training data');
      return;
    }

    // Separate features by class
    const yesFeatures: FeatureVector[] = [];
    const noFeatures: FeatureVector[] = [];

    for (let i = 0; i < labels.length; i++) {
      if (labels[i] === 'YES') {
        yesFeatures.push(features[i]);
      } else {
        noFeatures.push(features[i]);
      }
    }

    if (yesFeatures.length === 0 || noFeatures.length === 0) {
      console.warn('Need both YES and NO samples for training');
      return;
    }

    // Calculate class means
    const meanYes = this.calculateMean(yesFeatures);
    const meanNo = this.calculateMean(noFeatures);

    // Calculate pooled covariance matrix
    const covMatrix = this.calculatePooledCovariance(yesFeatures, noFeatures, meanYes, meanNo);

    // Invert covariance matrix (3x3)
    const covInv = this.invert3x3(covMatrix);

    // Calculate weight vector: w = Σ_inv * (μ_yes - μ_no)
    const meanDiff = [
      meanYes.mean - meanNo.mean,
      meanYes.peak - meanNo.peak,
      meanYes.latency - meanNo.latency,
    ];

    this.weights = this.matrixVectorMultiply(covInv, meanDiff);

    // Calculate bias: b = -0.5 * w^T * (μ_yes + μ_no)
    const meanSum = [
      meanYes.mean + meanNo.mean,
      meanYes.peak + meanNo.peak,
      meanYes.latency + meanNo.latency,
    ];

    this.bias = -0.5 * this.dotProduct(this.weights, meanSum);

    this.isTrained = true;

    console.log('LDA trained successfully');
    console.log('Weights:', this.weights);
    console.log('Bias:', this.bias);
  }

  /**
   * Predicts class for a single feature vector
   * 
   * Uses sigmoid function to convert discriminant to confidence [0, 1]
   * Confidence = P(YES | features)
   * 
   * @param features - Feature vector to classify
   * @returns Classification result with prediction and confidence
   */
  public predict(features: FeatureVector): ClassificationResult {
    if (!this.isTrained) {
      return {
        prediction: 'NO',
        confidence: 0.5,
      };
    }

    // Calculate linear discriminant: score = w^T * x + b
    const featureArray = [features.mean, features.peak, features.latency];
    const score = this.dotProduct(this.weights, featureArray) + this.bias;

    // Convert to probability using sigmoid
    const confidence = this.sigmoid(score);

    // Decision rule: YES if confidence > threshold
    const prediction = confidence > this.threshold ? 'YES' : 'NO';

    return {
      prediction,
      confidence,
    };
  }

  /**
   * Sets the decision threshold
   * Higher threshold = more conservative YES predictions
   * 
   * @param threshold - New threshold value [0, 1]
   */
  public setThreshold(threshold: number): void {
    this.threshold = Math.max(0, Math.min(1, threshold));
  }

  /**
   * Calculates mean features for a class
   */
  private calculateMean(features: FeatureVector[]): FeatureVector {
    const n = features.length;
    const sum = features.reduce(
      (acc, f) => ({
        mean: acc.mean + f.mean,
        peak: acc.peak + f.peak,
        latency: acc.latency + f.latency,
      }),
      { mean: 0, peak: 0, latency: 0 }
    );

    return {
      mean: sum.mean / n,
      peak: sum.peak / n,
      latency: sum.latency / n,
    };
  }

  /**
   * Calculates pooled covariance matrix
   * Pooled = weighted average of individual covariance matrices
   */
  private calculatePooledCovariance(
    class1: FeatureVector[],
    class2: FeatureVector[],
    mean1: FeatureVector,
    mean2: FeatureVector
  ): number[][] {
    const n1 = class1.length;
    const n2 = class2.length;
    const n = n1 + n2;

    // Initialize 3x3 covariance matrix
    const cov: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    // Features: [mean, peak, latency]
    const featureNames = ['mean', 'peak', 'latency'] as const;

    // Calculate covariance for class 1
    for (const f of class1) {
      const diff = [
        f.mean - mean1.mean,
        f.peak - mean1.peak,
        f.latency - mean1.latency,
      ];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cov[i][j] += diff[i] * diff[j];
        }
      }
    }

    // Calculate covariance for class 2
    for (const f of class2) {
      const diff = [
        f.mean - mean2.mean,
        f.peak - mean2.peak,
        f.latency - mean2.latency,
      ];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          cov[i][j] += diff[i] * diff[j];
        }
      }
    }

    // Divide by (n - 2) for unbiased estimate
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cov[i][j] /= n - 2;
      }
    }

    // Add small regularization to diagonal for numerical stability
    for (let i = 0; i < 3; i++) {
      cov[i][i] += 1e-6;
    }

    return cov;
  }

  /**
   * Inverts a 3x3 matrix using Cramer's rule
   */
  private invert3x3(matrix: number[][]): number[][] {
    const m = matrix;

    // Calculate determinant
    const det =
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    if (Math.abs(det) < 1e-10) {
      console.warn('Matrix is nearly singular, using identity');
      return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
    }

    const inv: number[][] = [];

    // Calculate adjugate matrix elements
    inv[0] = [
      (m[1][1] * m[2][2] - m[1][2] * m[2][1]) / det,
      (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det,
      (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det,
    ];

    inv[1] = [
      (m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det,
      (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det,
      (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det,
    ];

    inv[2] = [
      (m[1][0] * m[2][1] - m[1][1] * m[2][0]) / det,
      (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / det,
      (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / det,
    ];

    return inv;
  }

  /**
   * Multiplies a 3x3 matrix by a 3x1 vector
   */
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    const result: number[] = [];

    for (let i = 0; i < 3; i++) {
      result[i] = matrix[i][0] * vector[0] + matrix[i][1] * vector[1] + matrix[i][2] * vector[2];
    }

    return result;
  }

  /**
   * Calculates dot product of two vectors
   */
  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  /**
   * Sigmoid function for confidence calibration
   * Maps discriminant score to [0, 1]
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
}

/**
 * Default pre-trained LDA classifier with reasonable parameters
 * For demonstration purposes, uses fixed weights and bias
 */
export class DefaultLDAClassifier extends LDAClassifier {
  constructor() {
    super();

    // Pre-trained weights based on simulated data statistics
    // These would normally be learned from training data
    // Weights represent importance: higher = more discriminative
    this.setWeights([2.5, 3.0, 0.5]); // [mean, peak, latency]
    this.setBias(-1.2);

    console.log('Using default pre-trained LDA classifier');
  }

  private setWeights(weights: number[]): void {
    (this as any).weights = weights;
    (this as any).isTrained = true;
  }

  private setBias(bias: number): void {
    (this as any).bias = bias;
  }
}
