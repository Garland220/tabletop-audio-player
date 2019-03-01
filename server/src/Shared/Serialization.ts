
export class Deserializer {
    /**
     * Handle turning JSON string back into valid object
     */
    public static Deserialize(object: any) {

    }

    /**
     * Copies object2's property values into object1. TODO: Maybe replace with Object.assign
     */
    public static Extend(object1: any, object2: any) {
        for (let key in object1) {
            if (object1.hasOwnProperty(key) && object2[key]) {
                object1[key] = object2[key];
            }
        }
    }
}


export class Serializer {
    /**
     * Stringifies object and handles parent/child relationships without circular dependency
     */
    public static Serialize(object: any): string {
        let cache: any[] = [];

        let json: string = JSON.stringify(object, (key, value) => {
            if (!value) {
                return;
            }

            if (value.id) {
                if (key === 'sound' || key === 'parent') {
                    return value.id;
                }
            }

            return value;
        });

        return json;
    }
}
