$(document).ready(() => {
    /*
    Assignment: Create a 'T9 input dictionary' app using dummy data.
    Assigned to: Ajay Rawat
    Assigned by: Amit Verma
    Dated: 16 Jan 2018 
    */
    (($) => {
        // The App data---
        const appData = {
            init: () => {
                // Button codes/text---
                const keyValue = [
                    { id: '1', char: '.;!' }, { id: '2', char: 'abc' }, { id: '3', char: 'def' }, { id: '4', char: 'ghi' }, { id: '5', char: 'jkl' }, { id: '6', char: 'mno' }, { id: '7', char: 'pqrs' }, { id: '8', char: 'tuv' }, { id: '9', char: 'wxyz' }
                ];
                // Dummy data for dictionary---
                let dictionary = ['ajay', 'wootag', 'amit', 'rahul', 'raj', 'react', 'javascript', 'stylesheet', '!testing', 'dictionary'];
                // 'currentInput' stores the input string. 'filteredArr' updates as per users input, initially equals to dictionary. 
                appData.data = { currentInput: '', dictionary, keyValue, filteredArr: dictionary };
            },
            // returns id(1,2,..)/char(abc, def...) pair for input buttons ---
            getKeyValue: () => {
                return appData.data.keyValue;
            },
            // returns the dictionary data array.
            getDictionary: () => {
                return appData.data.dictionary;
            },
            // setting the new arr with updated data to dictionary, update the filtered array to be equal to dictionary.
            addToDictionary: (arr) => {
                appData.data.dictionary = arr;
                appData.updateFiltered(appData.data.dictionary);
            },
            // returns updated filtered array.
            getFiltered: () => {
                return appData.data.filteredArr;
            },
            // gets updated on user input, filtered array passed from controller.
            updateFiltered: (filterdArr) => {
                appData.data.filteredArr = filterdArr;
            },
            // simply takes the 'value' of the input string and assigns to 'currentInput'.
            setCurrentInput: (value, filterReset) => {
                appData.data.currentInput = value;
                // the filtered array gets reset to dictionary for two cases.
                // 1) when the clear button gets clicked, so everything resets.
                // 2) when the backspace button gets clicked, we filter the remaining text, character by character. 
                if (filterReset) {
                    appData.updateFiltered(appData.getDictionary());
                }
            },
            // returns current input text.
            getCurrentInput: () => {
                return appData.data.currentInput;
            },
            // updates the current string value. The second boolean parameter is for resetting the filter.
            backSpace: (value) => {
                appData.setCurrentInput(value, true);
            },
            // resets the current input text to empty string. The second boolean parameter is for resetting the filter.
            clearInput: () => {
                appData.setCurrentInput('', true);
            }
        }
        // The App view---
        const appView = {
            init: () => {
                // Generating keypad button list---
                $('#btns').append(appController.generateBtns());
                // Keypad button clicks---
                $('.btn').click((e) => {
                    e.preventDefault();
                    appController.setCurrentInput(e.target.id);
                    // Setting the input value in the view.
                    $('.input').text(appController.getCurrentInput());
                });
                // Clear/Reset button click---
                $('#clear').click((e) => {
                    e.preventDefault();
                    appController.clearInput();
                });
                // Backspace button click---
                $('#backspace').click((e) => {
                    e.preventDefault();
                    appController.backSpace();
                });
                // Form submit event. Adds a new word to dictionary.
                $('.addToDictionary form').submit((e) => {
                    e.preventDefault();
                    appController.addToDictionary(e.target.elements.addInput.value);
                    e.target.elements.addInput.value = '';
                    e.target.elements.addInput.focus();
                });
            },
            // Rendering the app view---
            render: () => {
                // Placing all the dummy dictionary items in the view to see and test the app better.
                $('#dictionary').html(appController.getDictionary().map(opt => opt).join(', '));
                // Setting the number of dictionary items in the view
                $('#dictWordCount').text(`(${appController.getDictionary().length})`);
                // Setting the number of filtered items in the view, if no text input is there, text would be blank.
                const filterCount = appController.getCurrentInput().length ? `(${appController.getFiltered().length})` : '';
                $('#filterWordCount').text(`${filterCount}`);
                // Setting clear/reset and backspace buttons disabled if there is no input.
                $('#clear, #backspace').prop('disabled', !appController.getCurrentInput().length);
                // text to be shown in the input area.
                const inputMsg = appController.getCurrentInput().length ?
                    appController.getCurrentInput() :
                    '<p class="msg">Press buttons to filter.</p>';
                $('.input').html(inputMsg);
                // text to be shown in the filter area.
                const filterMsg = appController.getCurrentInput().length && !appController.getFiltered().length ?
                    '<p class="msg">No Match Found!</p>' :
                    appController.getFiltered().join(', ');
                $('.filter').html(filterMsg);
            }
        }
        const appController = {
            generateBtns: () => {
                return appData.getKeyValue().map((key) => `<li><button class="btn" id="${key.id}">${key.id}(${key.char})</button></li>`);
            },
            // getting the dictionary data, to use in the view.
            getDictionary: () => {
                return appData.getDictionary();
            },
            // adding new item to dictionary.
            addToDictionary: (value) => {
                const valueToAdd = value.trim();
                // add only if input text is not blank and the text does not exists already in the dictionary.
                if (valueToAdd && appData.getDictionary().indexOf(valueToAdd) === -1) {
                    // add new words to dictionary removing white space and splitting the string with ','.
                    appData.addToDictionary([...appData.getDictionary(), ...valueToAdd.split(' ').join('').split(',')]);
                    // if already some keys have been pressed refilter the whole dictionary for each character of current input
                    if (appData.getCurrentInput().length) {
                        appController.filterAll();
                    } else {
                        // else just update the view to show the updated dictionary data
                        appView.render();
                    }
                }

            },
            // filters the dictionary data for the input character.
            // when a new character gets added through buttons a filtered 'objArr' is passed and the current character number to be filtered is 
            // taken from the current input length.
            // In case of backspace button click, the filtered array gets reset to dictionary and we iterate through each character of the remaining current input string, calling this function and providing the character index to be matched.
            filterDictionary: (objArr, charAt) => {
                const charStr = objArr[0].char;
                // currentCharNum equals index/charAt passed in case of backspace, else the current string length.
                const currentCharNum = charAt || appData.getCurrentInput().length;
                // iterating through each element of the filtered dictionary item, we split each word of the dictionary and check the 
                // current input character set(e.g., pqrs), if it has the current input character.
                const filteredWords = appData.getFiltered().filter((word) => {
                    return charStr.indexOf(word.split('')[currentCharNum - 1]) !== -1;
                });
                // update the filtered array.
                appData.updateFiltered(filteredWords);
            },
            // setting current input---invoked from view
            setCurrentInput: (keyClicked) => {
                // updating the new input string to data.
                appData.setCurrentInput(appData.getCurrentInput() + keyClicked);
                // filtering the dictionary by providing the single/current clicked key data.
                appController.filterDictionary(appData.getKeyValue().filter((key) => key.id === keyClicked));
                // rendering view to update changes.
                appView.render();
            },
            // used to show the filter message in the view. If there is no match an empty array will be returned. 
            getFiltered: () => {
                return appData.getFiltered().length === appData.getDictionary().length ? [] : appData.getFiltered();
            },
            // getting current input string.
            getCurrentInput: () => {
                return appData.getCurrentInput();
            },
            // clears the input field, resets the dictionary and renders the view to update changes.
            clearInput: () => {
                appData.clearInput();
                appView.render();
            },
            // removes last character of the current input string.
            backSpace: () => {
                appData.backSpace(appData.getCurrentInput().slice(0, appData.getCurrentInput().length - 1));
                // filtering through each character of the remaining input string after removing the last character.
                appController.filterAll();
            },
            // filtering through each character of the input string.
            filterAll: () => {
                appData.getCurrentInput().split('').forEach((numId, index) => {
                    appController.filterDictionary(appData.getKeyValue().filter((key) => key.id === numId), index + 1);
                });
                // render view to update changes.
                appView.render();
            },
            // initializing data, view---
            init: () => {
                appData.init();
                appView.init();
                appView.render();
            }
        }
        // initialzing 
        appController.init();
        // mixin jquery.
    })(jQuery);
});