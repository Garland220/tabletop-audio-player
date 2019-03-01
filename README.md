Tabletop Audio Player
======


Install
------
```bash
npm install
```


Play
------
start server with
```bash
npm start
```

admin opens localhost:8080/admin to control the sound

players open localhost:8080 in their browsers to listen


Options
------

You can add an 'adminKey' value to the settings file. This options then becomes required to access the admin url

```
/admin?key=[your key here]
```


Roadmap
------

1. Make it easier for users to add music. I plan to add UI for adding music
2. Add sound 'grouping'. Add UI for creating groups of sounds with specific settings. Useful for environments.
3. Multiple simultaneous sessions. Allow multiple sessions to run at once, and maybe host this and allow people to create their own sessions.
4. Sound sharing, and sound 'group' sharing.
5. Pipe logging into admin panel
6. Admin notification when users connect/disconnect
7. Sound searching
8. Soundcloud integration
9. Fantasy Grounds integration
