(function() {
  'use strict';

  var categories = [
    {name: 'ui', visible: false, color: null, closed: false, search: false},
    {name: 'fun', visible: true, color: null, closed: false, search: true},
    {name: 'environment', visible: true, color: null, closed: false, search: true},
    {name: 'civilization', visible: true, color: null, closed: false, search: true},
    {name: 'prop', visible: true, color: null, closed: false, search: true},
    {name: 'horror', visible: true, color: null, closed: false, search: true},
    {name: 'animal', visible: true, color: null, closed: false, search: true},
    {name: 'combat', visible: true, color: null, closed: false, search: true},
    {name: 'music', visible: true, color: null, closed: false, search: true}
  ];

  var tracks = [
    // UI Sounds
    {url: 'audio/sound/connect.ogg', key: 'connect', type: 'sound', category: 'ui', preload: 'auto', loop: false},
    {url: 'audio/sound/disconnect.ogg', key: 'disconnect', type: 'sound', category: 'ui', preload: 'auto', loop: false},


    // Fun Sounds
    {url: 'audio/sound/crowd_cheer2.ogg', key: 'criticalHit', type: 'sound', category: 'fun', preload: 'auto', volume: 0.3, loop: false},
    {url: 'audio/sound/the-price-is-right-losing-horn.ogg', key: 'criticalMiss', type: 'sound', category: 'fun', preload: 'auto', volume: 0.2, loop: false},
    {url: 'audio/sound/toasty.ogg', key: 'toasty', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/levelup.ogg', key: 'levelUp', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/boos.ogg', key: 'boos', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/wilhelm.ogg', key: 'wilhelm', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/timAllenGrunt.ogg', key: 'timAllenGrunt', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/dungeonMaster.ogg', key: 'dungeonMaster', type: 'sound', category: 'fun', volume: 1.0, loop: false},
    {url: 'audio/sound/bringOutYourDead.ogg', key: 'bringOutYourDead', type: 'sound', category: 'fun', volume: 1.0, loop: false},


    // Environment Sounds
    {url: 'audio/sound/cicada1_lp.ogg', key: 'cicadas', type: 'sound', category: 'environment', volume: 0.3, loop: true},
    {url: 'audio/sound/crickets2.ogg', key: 'crickets', type: 'sound', category: 'environment', volume: 0.2, loop: true},
    {url: 'audio/sound/stream.ogg', key: 'stream1', type: 'sound', category: 'environment', preload: 'none', loop: true},
    {url: 'audio/sound/stream1_lp.ogg', key: 'stream2', type: 'sound', category: 'environment', preload: 'none', loop: true},
    {url: 'audio/sound/rain1_lp.ogg', key: 'rain1', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/rain2_lp.ogg', key: 'rain2', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/rain3_lp.ogg', key: 'rain3', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/rain_outside.ogg', key: 'rainOutside', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/rain_on_roofb.ogg', key: 'rainOutside2', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/rain_on_shelter.ogg', key: 'rainOutside3', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/drips1_lp.ogg', key: 'drips', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/breeze.ogg', key: 'breeze', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/wind1_lp.ogg', key: 'wind1', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/wind2_lp.ogg', key: 'wind2', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/gale3a.ogg', key: 'wind3', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/wind_howl1.ogg', key: 'wind4', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/wind_desolate1.ogg', key: 'wind5', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/wind_outside.ogg', key: 'windOutside', type: 'sound', category: 'environment', loop: true},
    {url: 'audio/sound/thunder1.ogg', key: 'thunder1', type: 'sound', category: 'environment', loopDelay: 1000, randomDelay: 9000, loop: true},
    {url: 'audio/sound/thunder2.ogg', key: 'thunder2', type: 'sound', category: 'environment', loop: false},
    {url: 'audio/sound/rumble.ogg', key: 'rumble', type: 'sound', category: 'environment', preload: 'none', loop: false},
    {url: 'audio/sound/debris_rubble.ogg', key: 'rumble2', type: 'sound', category: 'environment', preload: 'none', loop: false},


    // Civilization Sounds
    {url: 'audio/sound/blacksmith1.ogg', key: 'blacksmith', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/boat_in_harbor2.ogg', key: 'boatHarbor', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/knife_sharpening.ogg', key: 'knifeSharpen', type: 'sound', category: 'civilization', preload: 'none', randomDelay: 2000, loop: false},
    {url: 'audio/sound/repairs_b.ogg', key: 'repairs', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/construction.ogg', key: 'construction', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/tavern_loop_lite_a.ogg', key: 'tavernBG', type: 'sound', category: 'civilization', preload: 'none', volume: 0.7, loop: true},
    {url: 'audio/sound/coins_on_bar.ogg', key: 'coinsCounter', type: 'sound', category: 'civilization', preload: 'none', loop: false},
    {url: 'audio/sound/church_bell.ogg', key: 'churchBell', type: 'sound', category: 'civilization', loop: false},
    {url: 'audio/sound/bellpad2.ogg', key: 'bellpad', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/fountain2.ogg', key: 'fountain', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/footsteps_lp1.ogg', key: 'footsteps1', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/footsteps2.ogg', key: 'footsteps2', type: 'sound', category: 'civilization', preload: 'none', loop: true},
    {url: 'audio/sound/wood_chimes1a.ogg', key: 'woodChimes', type: 'sound', category: 'civilization', preload: 'none', loop: true},


    // Prop sounds
    {url: 'audio/sound/torches.ogg', key: 'torches', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/fireplace_loop_c.ogg', key: 'campfire1', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/campfire1_lp.ogg', key: 'campfire2', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/burning_building3.ogg', key: 'campfire3', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/flag_wind.ogg', key: 'flagWind', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/tavern_sign.ogg', key: 'signWind', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/clock2.ogg', key: 'clock', type: 'sound', category: 'prop', preload: 'none', nativeLoop: true},
    {url: 'audio/sound/distant_drums1_lp.ogg', key: 'distantDrums', type: 'sound', category: 'prop', preload: 'none', loop: true},
    {url: 'audio/sound/war_drums_1.ogg', key: 'warDrums', type: 'sound', category: 'prop', preload: 'none', loop: true},
    {url: 'audio/sound/war_horn_1.ogg', key: 'warHorn', type: 'sound', category: 'prop', preload: 'none', loop: true},
    {url: 'audio/sound/rope_creaks_b.ogg', key: 'ropeCreak', type: 'sound', category: 'prop', loop: true},
    {url: 'audio/sound/tavern_door_wind.ogg', key: 'doorWindy', type: 'sound', category: 'prop', preload: 'none', loop: false},
    {url: 'audio/sound/door_knock.ogg', key: 'doorKnock', type: 'sound', category: 'prop', preload: 'none', loop: false},
    {url: 'audio/sound/door1_open.ogg', key: 'doorOpen1', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/door1_close.ogg', key: 'doorClose1', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/door_sm_open.ogg', key: 'doorOpen2', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/door_sm_close.ogg', key: 'doorClose2', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/door_open.ogg', key: 'doorOpen3', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/door_close.ogg', key: 'doorClose3', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/Gate_Open_00.ogg', key: 'gateOpen', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/metal_door_open.ogg', key: 'metalDoorOpen', type: 'sound', category: 'prop', loop: false},
    {url: 'audio/sound/metal_squeaks1.ogg', key: 'metalSqueak', type: 'sound', category: 'prop', loop: false},


    // Horror Sounds
    {url: 'audio/sound/treble_tone1.ogg', key: 'tone1', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/tone2.ogg', key: 'tone2', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/tone3.ogg', key: 'tone3', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/tone4.ogg', key: 'tone4', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/hi_tone_1.ogg', key: 'hiTone1', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/hi_tone_2.ogg', key: 'hiTone2', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/long_pulse_tone1.ogg', key: 'longPulse', type: 'sound', category: 'horror', volume: 1.0, loop: true},
    {url: 'audio/sound/ethereal1_lp.ogg', key: 'ethereal1', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/ethereal2_lp.ogg', key: 'ethereal2', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/ethereal3_lp.ogg', key: 'ethereal3', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/ethereal_dark1_lp.ogg', key: 'ethereal4', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/music/eerie_tone2a.ogg', key: 'eerieTone', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/music/shaker_rhythm2.ogg', key: 'shakerRhythm', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/music/short_tones1.ogg', key: 'shortTone', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/low_drone1.ogg', key: 'lowDrone1', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/low_drone2.ogg', key: 'lowDrone2', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/dungeon_bg1.ogg', key: 'dungeonBG', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/heartbeat.ogg', key: 'heartbeat1', type: 'sound', category: 'horror', loop: true},
    {url: 'audio/sound/heartbeat2.ogg', key: 'heartbeat2', type: 'sound', category: 'horror', nativeLoop: true},
    {url: 'audio/sound/riser1.ogg', key: 'riser1', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/riser2.ogg', key: 'riser2', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/pianohit.ogg', key: 'pianohit', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/floor-creak-01.ogg', key: 'floorCreak', type: 'sound', category: 'horror', volume: 0.2, loop: false},
    {url: 'audio/sound/scrape1a.ogg', key: 'scrape1', type: 'sound', category: 'horror', volume: 0.3, loop: false},
    {url: 'audio/sound/screams.ogg', key: 'screams', type: 'sound', category: 'horror', preload: 'none', loop: false},
    {url: 'audio/sound/spirit_breath1.ogg', key: 'spiritBreath', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/Creepy_Laugh.ogg', key: 'creepyLaugh', type: 'sound', category: 'horror', volume: 0.3, loop: false},
    {url: 'audio/sound/children_laugh.ogg', key: 'childrenLaugh', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/wail.ogg', key: 'wail', type: 'sound', category: 'horror', loopDelay: 2000, randomDelay: 10000, volume: 0.3, loop: false},
    {url: 'audio/sound/whispers1.ogg', key: 'whispers1', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/whispers2x.ogg', key: 'whispers2', type: 'sound', category: 'horror', loop: false},
    {url: 'audio/sound/vortex.ogg', key: 'vortex', type: 'sound', category: 'horror', loop: false},


    // Animal Sounds
    {url: 'audio/sound/birds_flap1.ogg', key: 'birdsScared', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/vultures.ogg', key: 'vulture', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/hawk1.ogg', key: 'hawk', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/owl2.ogg', key: 'owl', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/bats.ogg', key: 'bats', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/rats.ogg', key: 'rats', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/flies.ogg', key: 'flies', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/snake1.ogg', key: 'snake', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/dogs_barking2.ogg', key: 'dogsBarking1', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/dogs_barking.ogg', key: 'dogsBarking2', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/wolf_howl1.ogg', key: 'wolfHowl', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/wolf_distant.ogg', key: 'wolfHowl2', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/snarl1.ogg', key: 'wolfSnarl', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/roar.ogg', key: 'roar', type: 'sound', category: 'animal', preload: 'none', loop: false},
    {url: 'audio/sound/creature1.ogg', key: 'creature', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/cows1a.ogg', key: 'cows', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/chickens1a.ogg', key: 'chickens', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/birdsong2.ogg', key: 'birdsong', type: 'sound', category: 'animal', loop: false},
    {url: 'audio/sound/vultures.ogg', key: 'vultures', type: 'sound', category: 'animal', loop: false},


    // Combat Sounds
    {url: 'audio/sound/back_stab.ogg', key: 'stab', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/bow_single_shot.ogg', key: 'bow', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/club_attack.ogg', key: 'club', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/staff_attack.ogg', key: 'staff', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/shield_bash.ogg', key: 'shieldBash', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/heal_spell_1a.ogg', key: 'heal', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/conjuring.ogg', key: 'conjuring', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/earth_spell.ogg', key: 'earthSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/fire_spell_2.ogg', key: 'fireSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/ice_spell_2.ogg', key: 'iceSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/spell_1.ogg', key: 'miscSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/music_spell_2.ogg', key: 'musicSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/explosion1.ogg', key: 'explosion1', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/explosion_1.ogg', key: 'explosion2', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/nature_spell.ogg', key: 'natureSpell', type: 'sound', category: 'combat', preload: 'none', volume: 0.7, loop: false},
    {url: 'audio/sound/trap_arrow.ogg', key: 'trapArrow', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/trap_spike.ogg', key: 'trapSpike', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/Trap_01.ogg', key: 'trapBlade', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/magic_trap.ogg', key: 'trapMagic', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/trap_poison.ogg', key: 'trapPoison', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/trap_pit.ogg', key: 'trapPit', type: 'sound', category: 'combat', preload: 'none', loop: false},
    {url: 'audio/sound/trap_gate.ogg', key: 'trapGate', type: 'sound', category: 'combat', preload: 'none', loop: false},


    // Music
    {url: 'audio/music/music_1.ogg', key: 'music1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/music_3a.ogg', key: 'music3', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/siren_song_lp.ogg', key: 'sirenSong', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/music_eerie_flute1.ogg', key: 'eerieFlute1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/music_forest_action1.ogg', key: 'forestAction1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Somber_Music_Box.ogg', key: 'musicBox', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/celtic_harp_choir2.ogg', key: 'celticHarpChoir', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Serenade.ogg', key: 'serenade', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/moletown.ogg', key: 'moletown', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/city_wonder_cue_a.ogg', key: 'cityWonder', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/hurdy_gurdy2.ogg', key: 'hurdyGurdy2', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/lute_ballad.ogg', key: 'luteMusic1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/lute_music_1.ogg', key: 'luteMusic2', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/lute_music_2.ogg', key: 'luteMusic3', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Henry_Mancini_-Gypsy_Violin_Theme_From_Darling_Lil.ogg', key: 'gypsyViolin', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/combat1.ogg', key: 'combat1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/music_forest_combat1.ogg', key: 'combat2', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/drum_music_1c.ogg', key: 'combat3', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/city_action_cue.ogg', key: 'combat4', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Toccata_and_Fugue_in_D_minor.ogg', key: 'tocattaFugue', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Harpsichord_Concerto.ogg', key: 'harpsichordConcerto', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/1-02_Egmont_op.ogg', key: 'egmont', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Dominate_loop.ogg', key: 'dominateLoop', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Tension_Loop.ogg', key: 'tensionLoop1', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Tension_Loop2.ogg', key: 'tensionLoop2', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Tension_Loop3.ogg', key: 'tensionLoop3', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Heartbeat-Drone.ogg', key: 'heartbeatDrone', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Grave.ogg', key: 'grave', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Descent_Done.ogg', key: 'descentDone', type: 'music', category: 'music', preload: 'none', nativeLoop: true},
    {url: 'audio/music/Forgoten_tombs.ogg', key: 'forgotenTombs', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/Underwater.ogg', key: 'underwater', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/caravan.ogg', key: 'caravan', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/lost_village.ogg', key: 'lostVillage', type: 'music', category: 'music', preload: 'none', loop: true},
    {url: 'audio/music/sorrow.ogg', key: 'sorrow', type: 'music', category: 'music', preload: 'none', loop: true},
  ],

  div = document.createElement('div');
  div.id = 'connection';
  div.innerHTML = 'Disconnected';
  document.getElementById('connection').appendChild(div);
  titan.el = div;

  window.onload = (function() {
    titan.el.innerHTML = 'Loading...';
    titan.addTracks(tracks, null, function() {
      titan.el.innerHTML = 'Connecting to server...';
      titan.connect();
      titan.start();
    });
  });

})();