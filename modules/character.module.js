// EVENTS ON CHARACTER BUILD PAGE:
// Randomize (generate attribs/stats), Save (POST Character), Open nav drawer
"use strict"

const characterModule = (function() {
    // Private

    let _render = false;
    
    function _generateCharacterForm(state) {
        // Make the list of stats a ul instead of a bunch of divs
        // add value="${state.character.name}" into the attributes
        return `
        <form class="build-form" id="js-build-form">
            <p class="build-paragraph">
                Name: <input type="text" class="build-input text-input input-name" id="input-name" value="${state.currentCharacter.name}" placeholder="Leroy Jenkins"><br>
                Race: <input type="text" class="build-input text-input input-race" id="input-race" value="${state.currentCharacter.attributes.race}" placeholder="Human"><br>
                Class: <input type="text" class="build-input text-input input-class" id="input-charClass" value="${state.currentCharacter.attributes.charClass}" placeholder="Barbarian"><br>
                Accent: <input type="text" class="build-input text-input input-accent" id="input-accent" value="${state.currentCharacter.attributes.accent}" placeholder="Loud"><br>
                Quirk: <input type="text" class="build-input text-input input-quirk" id="input-quirk" value="${state.currentCharacter.attributes.quirk}" placeholder="Is very impatient">
                <br>
                <div class="stats">
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-STR" value="${state.currentCharacter.stats.STR}"><br>
                        STR
                    </div> 
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-CON" value="${state.currentCharacter.stats.CON}"><br>
                        CON
                    </div> 
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-DEX" value="${state.currentCharacter.stats.DEX}"><br>
                        DEX
                    </div> 
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-CHA" value="${state.currentCharacter.stats.CHA}"><br>
                        CHA
                    </div> 
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-WIS" value="${state.currentCharacter.stats.WIS}"><br>
                        WIS
                    </div> 
                    <div class="stat">
                        <input type="number" class="build-input stat-input" id="input-INT" value="${state.currentCharacter.stats.INT}"><br>
                        INT
                    </div> 
                </div>
                <br>
                <strong>Background:</strong><br>
                <textarea class="character-background-box build-input" id="input-background"></textarea>
            </p>
        </form>
        `
    };

    
    
    function _randomize(arr) {
        const randomIndex = (Math.floor(Math.random() * arr.length));
        return arr[randomIndex];

        // Possible feature: user customizes the randomizable features and attributes
    }

    // this function will call to the API to retrieve the default randomizable attributes
    function _randomizeAttributes(state) {
        const name = document.getElementById("input-name");
        const race = document.getElementById("input-race");
        const charClass = document.getElementById("input-charClass");
        const accent = document.getElementById("input-accent");
        const quirk = document.getElementById("input-quirk");

        state.currentCharacter.name = _randomize(randomNames);
        state.currentCharacter.attributes.race = _randomize(randomRaces);
        state.currentCharacter.attributes.charClass = _randomize(randomClasses);
        state.currentCharacter.attributes.accent = _randomize(randomVoices);
        state.currentCharacter.attributes.quirk = _randomize(randomQuirks);

        name.value = state.currentCharacter.name;
        race.value = state.currentCharacter.attributes.race;
        charClass.value = state.currentCharacter.attributes.charClass;
        accent.value = state.currentCharacter.attributes.accent;
        quirk.value = state.currentCharacter.attributes.quirk;

        // reassign all these to put them into the state, then call Render
        // Find a way to populate the state.currentCharacter with the value
        // in the field, so that it saves custom inputs instead of just
        // randomized inputs
        
        // const attributes = document.getElementsByClassName("build-input");

    }

    function _randomizeStatNumber() {
        return Math.floor(Math.random() * 6) * 3 + 3;
    }
    
    function _randomizeAllStats(state) {
        
        const statFields = state.currentCharacter.stats;
        statFields.STR = _randomizeStatNumber();
        statFields.CON = _randomizeStatNumber();
        statFields.DEX = _randomizeStatNumber();
        statFields.WIS = _randomizeStatNumber();
        statFields.CHA = _randomizeStatNumber();
        statFields.INT = _randomizeStatNumber();
        console.log(statFields);
    }
    
    // Problem (SOLVED): the stats aren't populating because they were formerly part of the DOM, but now they're
    // part of the STORE and they're not being populated from it. (the store object's key-value pairs need
    // to update when the randomizeAllStats function fires)
    // Problem: When saving a character, if there has been any custom input on the form, the character will be
    // saved properly but the custom field will revert back to it's pre-custom input (either empty or random).
    // Need to find a way to keep the custom value in the field after saving

    function _randomizeCharacter(state) {
        $("#js-randomize-button").on("click", event => {
            event.preventDefault;
            _randomizeAllStats(state);
            _randomizeAttributes(state);
            render(state);
        });
    }

    // this will POST the character if new, or PUT the character if editing an existing one.
    // 
    function _saveCharacter(state) {
        $("#js-save-button").click(event => {
            event.preventDefault;
            const name = document.getElementById("input-name").value;
            const attributes = {
                race: document.getElementById("input-race").value,
                charClass: document.getElementById("input-charClass").value,
                accent: document.getElementById("input-accent").value,
                quirk: document.getElementById("input-quirk").value
            };
            const stats = {
                STR: document.getElementById("input-STR").value,
                CON: document.getElementById("input-CON").value,
                DEX: document.getElementById("input-DEX").value,
                WIS: document.getElementById("input-WIS").value,
                CHA: document.getElementById("input-CHA").value,
                INT: document.getElementById("input-INT").value
            };
            const background = document.getElementById("input-background").value;

            const newCharacter = {
                name,
                attributes,
                stats,
                background
            };

            // state.currentCharacter = newCharacter

            console.log(newCharacter);
            state.characters.push(newCharacter);
            console.log(state.characters);
            render(state);
            alert("Character Saved!");
            document.getElementById("js-build-form").reset();
        });
        
    }
    

    // Public

    function initiate(mainRender) {
        if (!_render) {
            _render = mainRender;
        };
    };

    function renderCharacterPage(state) {
        const buildForm = _generateCharacterForm(state);
        const characterPageContent = `
            <div class="page-container">
                <header class="build-page-header" role="banner">
                    <h1>Build a New Character</h1>
                </header>
                <div class="button-container">
                    <button class="randomize-button" id="js-randomize-button">
                        <span class="fas fa-dice"></span><br>
                        Randomize
                    </button>
                    <button class="save-button" id="js-save-button">
                        <span class="fas fa-save"></span><br>
                        Save
                    </button>
                </div>
                <div class="build-box" role="section">
                    ${buildForm}
                </div>
            </div>
        `

        const characterPage = commonModule.renderLayoutNav(state, characterPageContent);
        $('#root').append(characterPage);
        commonModule.attachEventHandlers(state);
        _randomizeCharacter(state);
        // _customizeCharacter(state);
        _saveCharacter(state);
        // _toggleNavDrawer();
        // THis is gonna be handled by the
    }

    return {
        render: renderCharacterPage,
        initiate
    }


})();

