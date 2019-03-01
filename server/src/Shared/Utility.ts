
interface Number {
    toHex(): string;
}

interface String {
    format(): string;
    fromHex(): number;
    padZeros(length: number, separator: string): string;
}

Number.prototype.toHex = function(this: number): string {
    let value: string = this.toString(16).toUpperCase();
    return (value.length == 1) ? (`0${value}`) : value;
};

String.prototype.format = function(this: string): string {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp(`\\{${i}\\}`, 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.fromHex = function(this: string): number {
    return parseInt(this, 16);
}

String.prototype.padZeros = function(this: string, length: number): string {
    let formatted = this;
    while (formatted.length < length) {
        formatted = '0' + formatted;
    }
    return formatted;
};
