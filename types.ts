export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Lime = 'lime',
  Rose = 'rose',
  Yellow = 'yellow',
  Coffee = 'coffee',
  Lavender = 'lavender',
  Sky = 'sky',
  Red = 'red',
}

export enum ActiveTab {
  Calculator = 'Calculator',
  UnitConverter = 'Unit Converters',
  Health = 'Health Tools',
  Finance = 'Finance Tools',
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
}