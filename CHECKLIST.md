## checkList
## minimal features:
### index:
- [x] details about the game
- [x] link to the game
### game:
- [x] any loading progress bar
- [x] login
    - [x] websocket login (client, server)
    - [x] use coockies
- [x] sign up
    - [x] ajax sign up (client, server)
    - [x] ajax check username availability
- [x] game navbar
    - [x] show username
    - [x] show resources
    - [x] show xp
- [x] HTML home view
    - [ ] get mission
    - [x] enter mission
- [ ] PIXI mission view
    - [ ] background color
    - [ ] cells
    - [ ] enemys
    - [ ] move with cube
    - [ ] quit mission
- [ ] PIXI battle view
    - [ ] 2 designed attack cards
    - [ ] 4 designed move cards
    - [ ] enemy attack/move cards AI- random
    - [ ] round preview: 3 cards per round
        - [ ] choose cards screen
        - [ ] perform user and enemy cards
        - [ ] show hp status for user and enemy
    - [ ] win- continue mission. loss- restart mission
    - [ ] quit battle and mission
- [ ] server obey client request: read and write to the database
- [ ] spells.json data: spells[]
- [ ] missions.json data: missions[]
- [ ] database form
    - username
    - password
    - xp
    - resources
        + lights
        + gems
        + flowers
    - spells []
        + id -> .json of spells[] by id with: name, price, damage.
        + equip
    - mission
        + id -> .json of missions[] by id with: cells form, backgroud color, enemys[]:
            - isAlive
            - current cell
            - spells[]
            - name
        + current cell
        + battle
            + enemy id -> by mission.enemys[]
            + hp statuses
## more features:
### index
- [ ] trailer
- [ ] screenshots
### game
- [ ] game nav bar
    - [ ] xp progress to next level
- [ ] clothes
- [ ] maps
- [ ] ? player vs player
- [ ] spells upgrades
- [ ] sounds
- [ ] AI levels
- [ ] game guide
- [ ] enemys types, levels
- [ ] PIXI home view
- [ ] better PIXI animations and graphics
- [ ] more: missions, spells, clothes, types...
- [ ] server security
