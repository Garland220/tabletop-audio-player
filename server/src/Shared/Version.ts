
export class Version {
    private major: number = 0;
    private minor: number = 0;
    private patch: number = 0;

    public get Major(): number {
        return this.major;
    }

    public get Minor(): number {
        return this.minor;
    }

    public get Patch(): number {
        return this.patch;
    }

    constructor(major: number, minor: number, patch: number) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    public toArray(): number[] {
        return [this.major, this.minor, this.patch];
    }

    public fromArray(array: number[] | string[]): void {
        if (array.length === 3) {
            this.major = parseInt(<string>array[0], 10);
            this.minor = parseInt(<string>array[1], 10);
            this.patch = parseInt(<string>array[2], 10);
        }
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    public fromString(string: string): void {
        let array: string[] = string.split('.');
        this.fromArray(array);
    }
}
