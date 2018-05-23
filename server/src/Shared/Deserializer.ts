

export class Deserializer {
    public static extend(obj1: any, obj2: any) {
        for (let key in obj1) {
            if (obj1.hasOwnProperty(key) && obj2[key]) {
                obj1[key] = obj2[key];
            }
        }
    }
}
