
### Project Description

This is a node script I wrote to clean up data from the publicly available History of Hearthstone dataset (https://www.kaggle.com/romainvincent/history-of-hearthstone).

The node script also adds the following features onto the dataset...
    - mana_cost_zero: a count of the cards in the deck with mana cost zero,
    - mana_cost_one: a count of the cards in the deck with mana cost one,
    - mana_cost_two: a count of the cards in the deck with mana cost two,
    - mana_cost_three: a count of the cards in the deck with mana cost three,
    - mana_cost_four: a count of the cards in the deck with mana cost four,
    - mana_cost_five: a count of the cards in the deck with mana cost five,
    - mana_cost_six: a count of the cards in the deck with mana cost six,
    - mana_cost_seven: a count of the cards in the deck with mana cost seven,
    - mana_cost_eight: a count of the cards in the deck with mana cost eight,
    - mana_cost_nine: a count of the cards in the deck with mana cost nine,
    - mana_cost_other: a count of the cards in the deck with mana cost > nine,
    - total_mana_cost: a count of the total mana cost of all cards in the deck,
    - card_type_enchantment: a count of the cards in the deck with card type enchantment,
    - card_type_hero: a count of the cards in the deck with card type hero,
    - card_type_hero_power: a count of the cards in the deck with card type hero power,
    - card_type_minion: a count of the cards in the deck with card type minion,
    - card_type_spell: a count of the cards in the deck with card type spell,
    - card_type_weapon: a count of the cards in the deck with card type weapon,
    - card_rarity_free: a count of the cards in the deck with free rarity,
    - card_rarity_common: a count of the cards in the deck with common rarity,
    - card_rarity_rare: a count of the cards in the deck with rare rarity,
    - card_rarity_epic: a count of the cards in the deck with epic rarity,
    - card_rarity_legendary: a count of the cards in the deck with legendary rarity,

### Files
    data-cleaner.js - node script for cleaning up data
    data.csv - dataset from kaggle, History of Hearthstone
    refs.json - cards data for reference from kaggle dataset, History of Hearthstone
    hearthstone.csv - dataset post clean-up and addition of features

### To Run script
     (Make sure you have NodeJS installed!)
     - download project
     - naviagte to project directory via bash (or other terminal program)
     - run `npm install` to install all the necessary packages
     - once installation is complete, you can type `node data-cleaner.js` to run the script