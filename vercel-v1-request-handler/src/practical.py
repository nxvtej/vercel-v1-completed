import numpy as np

import matplotlib.pyplot as plt

 

# Function to integrate def func(x):

return x**2

 


h = (b - a) / n

x = np.linspace(a, b, n + 1) y = func(x)

integral = h * (np.sumYes - 0.5 * (y[0] + y[-1])) return integral
h = (b - a) / n

x = np.linspace(a, b, n + 1) y = func(x)

integral = h / 3 * (y[0] + 4 * np.sum(y[1:-1:2]) + 2 * np.sum(y[2:-2:2]) + y[-1]) return integral

print(f'True Integral Value: {true_value}')

 
trapezoidal_result = trapezoidal_rule(func, a, b, n) simpsons_result = simpsons_rule(func, a, b, n)

print(f'n={n}: Trapezoidal Result={trapezoidal_result:.4f}, Simpsons Result={simpsons_result:.4f}')


plt.plot(x_values, func(x_values), label='$x^2$ function') plt.fill_between(x_values, func(x_values), alpha=0.2, label='Area under the curve')

plt.ylabel('f(x)') plt.legend() plt.show()