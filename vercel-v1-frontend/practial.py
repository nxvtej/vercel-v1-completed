import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load the image in grayscale
image = cv2.imread('input_image.jpg', cv2.IMREAD_GRAYSCALE)

# Apply Gaussian blur (spatial filter) to reduce noise
gaussian_blur = cv2.GaussianBlur(image, (5, 5), 0)

# Apply Laplacian filter (sharpening)
sharpened = cv2.convertScaleAbs(cv2.Laplacian(image, cv2.CV_64F))

# Convert to frequency domain using Fourier Transform
f_transform = np.fft.fftshift(np.fft.fft2(image))
magnitude_spectrum = 20 * np.log(np.abs(f_transform))

# Apply a high-pass filter in frequency domain
rows, cols = image.shape
mask = np.ones((rows, cols), np.uint8)
mask[rows//2-30:rows//2+30, cols//2-30:cols//2+30] = 0
img_back = np.abs(np.fft.ifft2(np.fft.ifftshift(f_transform * mask)))

# Display images
plt.figure(figsize=(10, 6))
plt.subplot(1, 3, 1), plt.imshow(gaussian_blur, cmap='gray'), plt.title('Blurred')
plt.subplot(1, 3, 2), plt.imshow(sharpened, cmap='gray'), plt.title('Sharpened')
plt.subplot(1, 3, 3), plt.imshow(img_back, cmap='gray'), plt.title('High-pass Filter')
plt.show()
