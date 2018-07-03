import { Hash } from './';


export class Colors {
    public static Apply(color: string | string[], input: string | string[]): string | string[] {
        if (typeof input === 'string') {
            let inputString: string = <string>input;

            return `${Colors.Assemble(color)}${inputString}${Colors.Reset()}`;
        }
        else {
            let inputArray = <string[]>input;
            inputArray.unshift(Colors.Assemble(color));
            inputArray.push(Colors.Reset());

            return inputArray;
        }
    }

    public static Assemble(colors: string | string[], sequence: string = '\x1b', finisher: string = 'm'): string {
        let codeString: string = '';

        if (typeof colors === 'string') {
            let color: string = <string>colors;
            codeString = `${Colors.GetCode(color)}`;
        }
        else {
            for (let i = 0; i < colors.length; i += 1) {
                codeString += `${Colors.GetCode(colors[i])}`;
                if (colors.length > i) {
                    codeString += ';';
                }
            }
        }

        return `${sequence}[${codeString}${finisher}`;
    }

    public static CapitalizeFirstLetter(input: string): string {
        return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
    }

    public static GetCode(color: string): number {
        return ColorList[Colors.CapitalizeFirstLetter(color)];
    }

    public static Reset(): string {
        return Colors.Assemble('ResetAll')
    }
};

export const ColorList: Hash<number> = {
    ResetAll: 0, // Resets all values

    Bright: 1,
    Dim: 2,
    Italic: 3,
    Underscore: 4,

    Blink: 5,
    RapidBlink: 6, // Usually not supported
    Reverse: 7, // Swap Foreground and Background colors
    Conceal: 8, // Usually not supported
    CrossedOut: 9, // Not widely supported

    ResetFont: 10,

    ResetBright: 21,
    ResetItalic: 23,
    ResetUnderline: 24,

    ResetBlink: 25,
    ResetRapidBlink: 26, // Usually not supported
    ResetReverse: 27,
    ResetConceal: 28, // Usually not supported
    ResetCrossedOut: 29, // Not widely supported

    // Foreground Colors
    Black: 30,
    Red: 31,
    Green: 32,
    Yellow: 33,
    Blue: 34,
    Magenta: 35,
    Cyan: 36,
    White: 37,
    Crimson: 38,
    ResetForeground: 39, // Turns off 30-38

    // Background Colors
    BlackBackground: 40,
    RedBackground: 41,
    GreenBackground: 42,
    YellowBackground: 43,
    BlueBackground: 44,
    MagentaBackground: 45,
    CyanBackground: 46,
    WhiteBackground: 47,
    CrimsonBackground: 48,
    ResetBackground: 49 // Turns off 40-48
};
