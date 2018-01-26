import { User } from './';


export class UserHash {
    [id: number]: User;
}

export class UserController {
    // Dictionaries
    private static users: UserHash = {};
    private static userCount: number = 0;

    public static get List(): UserHash {
        return UserController.users;
    }

    public static get Count(): number {
        return UserController.userCount;
    }

    public static get Array(): User[] {
        return Object.keys(UserController.users).map(function(id: string) {
            return UserController.users[<any>id];
        });
    }

    public static Add(user: User): void {
        if (!(user instanceof User)) {
            return;
        }

        if (!UserController.users[user.ID]) {
            UserController.users[user.ID] = user;
            UserController.userCount += 1;
        }
    }

    public static Remove(id: number): void {
        if (id && UserController.users[id]) {
            UserController.users[id] = null;
            delete UserController.users[id];
            UserController.userCount -= 1;
        }
    }

    public static Get(id: number): User {
        if (id && UserController.users[id]) {
            return UserController.users[id];
        }
        return null;
    }
}
