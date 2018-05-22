import { Server } from '../';
import { Hash } from '../Shared';
import { User } from './';


export class UserController {
    // Dictionaries
    private static data: Hash<User> = {};
    private static array: User[] = [];
    private static userCount: number = 0;

    public static get List(): Hash<User> {
        return UserController.data;
    }

    public static get Count(): number {
        return UserController.userCount;
    }

    public static get Array(): User[] {
        if (!UserController.array || UserController.array.length === 0) {
            UserController.array = Object.keys(UserController.data).map((id: string) => {
                return UserController.data[<any>id];
            });
        }

        return UserController.array;
    }

    public static Add(user: User): void {
        if (!(user instanceof User)) {
            return;
        }

        if (!UserController.data[user.ID]) {
            UserController.data[user.ID] = user;
            UserController.userCount += 1;
        }
    }

    public static Remove(id: number): void {
        if (id && UserController.data[id]) {
            UserController.data[id] = null;
            delete UserController.data[id];
            UserController.userCount -= 1;
        }
    }

    public static Get(id: number): User {
        if (id && UserController.data[id]) {
            return UserController.data[id];
        }

        return null;
    }

    public static LoadAll(): Promise<any> {
        return User.find().then((users) => {
            for (let index in users) {
                let user = users[index];

                if (user && user.ID) {
                    UserController.Add(user);
                }
            }

            Server.Log(`Loaded ${users.length} users from database.`);
            return users;
        }).catch((error) => {
            Server.Error('(UserController :: LoadAll)', error);
        });
    }

    public static Load(userId: number): Promise<any> {
        return User.findOneById(userId).then((user) => {
            if (user && user.ID) {
                UserController.Add(user);
            }
        }).catch((error) => {
            Server.Error('(UserController :: Load)', error);
        });
    }
}
