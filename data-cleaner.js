
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const moment = require('moment');

// data to collect updated info for write
const data = [];

// values to collect counts for logging
let MISSING_CARD = 0;
let MISSING_MANA_COST = 0;
let MISSING_CARD_TYPE = 0;
let MISSING_CARD_RARITY = 0;

// create dictionary from json of cards data
const refs = require('./refs.json')

const cardsDict = refs.reduce((dict, card) => {
    if (card.dbfId) {
        dict[card.dbfId] = card;
    }
    return dict;
}, {});

// function to generate new columns based on cards data
function getAdditionalDeckData(cardsArray) {
    const newColumns = {
        mana_cost_zero: 0,
        mana_cost_one: 0,
        mana_cost_two: 0,
        mana_cost_three: 0,
        mana_cost_four: 0,
        mana_cost_five: 0,
        mana_cost_six: 0,
        mana_cost_seven: 0,
        mana_cost_eight: 0, 
        mana_cost_nine: 0,
        mana_cost_other: 0,
        total_mana_cost: 0,
        card_type_enchantment: 0,
        card_type_hero: 0,
        card_type_hero_power: 0,
        card_type_minion: 0,
        card_type_spell: 0,
        card_type_weapon: 0,
        card_rarity_free: 0,
        card_rarity_common: 0,
        card_rarity_rare: 0,
        card_rarity_epic: 0,
        card_rarity_legendary: 0,
    };
    cardsArray.map(cardId => {
        if(!cardsDict[cardId]) {
            MISSING_CARD++;
            return;
        }
        if(cardsDict[cardId].cost === undefined && cardsDict[cardId].cost === null) {
            MISSING_MANA_COST++;
        }
        if(!cardsDict[cardId].type) {
            MISSING_CARD_TYPE++;
        }
        if(!cardsDict[cardId].rarity) {
            MISSING_CARD_RARITY++;
        }
        newColumns.total_mana_cost += cardsDict[cardId].cost;
        switch(cardsDict[cardId].cost) {
            case 0:
                newColumns.mana_cost_zero++;
                break;
            case 1:
                newColumns.mana_cost_one++;
                break;
            case 2:
                newColumns.mana_cost_two++;
                break;
            case 3:
                newColumns.mana_cost_three++;
                break;
            case 4:
                newColumns.mana_cost_four++;
                break;
            case 5:
                newColumns.mana_cost_five++;
                break;
            case 6:
                newColumns.mana_cost_six++;
                break;
            case 7:
                newColumns.mana_cost_seven++;
                break;
            case 8:
                newColumns.mana_cost_eight++;
                break;
            case 9:
                newColumns.mana_cost_nine++;
                break;
            default:
                newColumns.mana_cost_other++;
                break;
        }
        switch(cardsDict[cardId].type) {
            case 'ENCHANTMENT':
                newColumns.card_type_enchantment++;
                break;
            case 'HERO':
                newColumns.card_type_hero++;
                break;
            case 'HERO_POWER':
                newColumns.card_type_hero_power++;
                break;
            case 'MINION':
                newColumns.card_type_minion++;
                break;
            case 'SPELL':
                newColumns.card_type_spell++;
                break;
            case 'WEAPON':
                newColumns.card_type_weapon++;
                break;
        }
        switch(cardsDict[cardId].rarity) {
            case 'FREE':
                newColumns.card_rarity_free++;
                break;
            case 'COMMON':
                newColumns.card_rarity_common++;
                break;
            case 'RARE':
                newColumns.card_rarity_rare++;
                break;
            case 'EPIC':
                newColumns.card_rarity_epic++;
                break;
            case 'LEGENDARY':
                newColumns.card_rarity_legendary++;
                break;
        }
    });
    return newColumns;
};

// check if deck is valid type, return true if valid, false if invalid
function validateDeckType(deck_type) {
    const validDeckTypes = ['Ranked Deck', 'Tournament'];
    return validDeckTypes.some(deckType => deckType === deck_type);
}

function removeStringUnknowns(value) {
    // if value exists and is not Unknown or None, return value
    if(value && value !== 'Unknown' && value !== 'None') {
        return value;
    }
    // else return '' (missing value in csv)
    return undefined;
}

function removeNumericUnknowns(value) {
    // if value exists and is not Unknown or None, return value
    if(value !== undefined && value !== null && value !== 'Unknown' && value !== 'None') {
        return value;
    }
    // else return '' (missing value in csv)
    return undefined;
}

function getUnixFormattedDate(date) {
    // if date exists and is valid format, return date in unix format
    if(date && moment(date, 'YYYY-MM-DD', true).isValid()) {
        return moment(date, 'YYYY-MM-DD').unix();
    }
    // else return '' (missing value in csv)
    return undefined;
}

// clean up data and add on the new columns
function cleanDeckData(deck) {
    const {
        craft_cost,
        date,
        deck_archetype,
        deck_class,
        deck_format,
        deck_id,
        deck_set,
        deck_type,
        rating,
    } = deck;

    deck.craft_cost = removeNumericUnknowns(craft_cost);
    deck.date = getUnixFormattedDate(date);
    deck.deck_archetype = removeStringUnknowns(deck_archetype);
    deck.deck_class = removeStringUnknowns(deck_class);
    deck.deck_format = removeStringUnknowns(deck_format);
    deck.deck_id = removeNumericUnknowns(deck_id);
    deck.deck_set = removeStringUnknowns(deck_set);
    deck.deck_type = removeStringUnknowns(deck_type);
    deck.rating = removeNumericUnknowns(rating);
    deck.title = removeStringUnknowns(deck_type);
    deck.user = removeStringUnknowns(deck_type);

    const cardsArray = [];
    for(let x = 0; x < 30; x++) {
        deck[`card_${x}`] && cardsArray.push(deck[`card_${x}`]);
    }
    const newColumns = getAdditionalDeckData(cardsArray);
    const newDeckData = {
        ...deck,
        ...newColumns,
    };
    data.push(newDeckData);
};

// Read data from CSV
fs.createReadStream('./data.csv')
    .pipe(csv.parse({headers: true}))
    .on('error', err => console.error(err))
    .on('data', row => {
        // check if deck data in row is valid, if not, skip it
        if(!row.deck_type || !validateDeckType(row.deck_type)) return;
        // if deck data in row is valid, clean it up before write
        cleanDeckData(row);
    })
    .on('end', rowCount => {
        // log info when done parsing
        console.log(`Parsed ${rowCount} rows`);
        console.log(`Missing ${MISSING_CARD} cards`);
        console.log(`Missing ${MISSING_MANA_COST} mana cost`);
        console.log(`Missing ${MISSING_CARD_TYPE} card type`);
        console.log(`Missing ${MISSING_CARD_RARITY} card rarity`);
        // write data to new csv
        csv.writeToPath(path.resolve(__dirname, 'hearthstone.csv'), data, {headers: true})
            .on('error', err => console.error(err))
            .on('finish', () => console.log(`Done writing.`));
    });
