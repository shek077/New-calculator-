import type { Theme } from './types';

export const THEME_DETAILS: Record<Theme, { name: string; class: string; }> = {
  light: { name: 'Light', class: 'theme-light' },
  dark: { name: 'Dark', class: 'theme-dark' },
  lime: { name: 'Creamy Lime', class: 'theme-lime' },
  rose: { name: 'Creamy Rose', class: 'theme-rose' },
  yellow: { name: 'Sunny Yellow', class: 'theme-yellow' },
  coffee: { name: 'Brown Coffee', class: 'theme-coffee' },
  lavender: { name: 'Calm Lavender', class: 'theme-lavender' },
  sky: { name: 'Sky Blue', class: 'theme-sky' },
  red: { name: 'Bold Red', class: 'theme-red' },
};

// A more standard 4x5 grid. '0' will be styled to span 2 columns.
export const BASIC_BUTTONS = [
    ['C', '⌫', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
];

// A clean 5x7 grid. The equals button is a single item in the last row to be rendered as full-width.
export const SCIENTIFIC_BUTTONS = [
    ['sin', 'cos', 'tan', 'log', 'ln'],
    ['(', ')', '^', '√', 'π'],
    ['x!', 'e', 'C', '⌫', '%'],
    ['7', '8', '9', '/', '*'],
    ['4', '5', '6', '-', '+'],
    ['1', '2', '3', '0', '.'],
    ['=']
];


export const UNIT_CONVERTERS = {
  Length: {
    'Meters (m)': 1,
    'Kilometers (km)': 1000,
    'Feet (ft)': 0.3048,
    'Miles (mi)': 1609.34,
    'Inches (in)': 0.0254,
  },
  Mass: {
    'Kilograms (kg)': 1,
    'Grams (g)': 0.001,
    'Pounds (lb)': 0.453592,
    'Ounces (oz)': 0.0283495,
  },
  Temperature: {
    'Celsius (°C)': (c: number) => c,
    'Fahrenheit (°F)': (f: number) => (f - 32) * 5/9,
    'Kelvin (K)': (k: number) => k - 273.15,
  },
  TemperatureOutput: {
    'Celsius (°C)': (c: number) => c,
    'Fahrenheit (°F)': (c: number) => (c * 9/5) + 32,
    'Kelvin (K)': (c: number) => c + 273.15,
  },
  Time: {
    'Seconds (s)': 1,
    'Minutes (min)': 60,
    'Hours (hr)': 3600,
    'Days': 86400,
  },
  Volume: {
    'Liters (L)': 1,
    'Milliliters (mL)': 0.001,
    'Gallons (US gal)': 3.78541,
    'Cups (US cup)': 0.24,
  },
  Speed: {
    'm/s': 1,
    'km/h': 0.277778,
    'mph': 0.44704,
    'knots': 0.514444,
  },
  Area: {
    'Square Meters (m²)': 1,
    'Square Feet (ft²)': 0.092903,
    'Acres': 4046.86,
    'Hectares': 10000,
  },
  Energy: {
    'Joules (J)': 1,
    'Calories (cal)': 4.184,
    'Watt-hours (Wh)': 3600,
  },
  Currency: { // Note: Static rates. A real app would fetch these from an API.
    'USD': 1,
    'EUR': 1.09,
    'GBP': 1.27,
    'JPY': 0.0067,
    'INR': 0.012,
  }
};