'use strict';

const Alexa = require('alexa-sdk');
const ProteinTracker = require('protein-tracker');

const APP_ID = 'amzn1.ask.skill.7bd8bda5-fed1-4d46-8d80-a62ca31e086c';

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = LANGUAGE_STRINGS;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AddGramsOfProtein': function () {
        const userId = this.event.session.user.userId;
        const gramsOfProtein = this.event.request.intent.slots.GramsOfProtein.value;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);

        (function write(index) {ProteinTracker.putGramsOfProtein(userId, date, gramsOfProtein, function(err, result) {
            const cardTitle = index.t("ADD_PROTEIN_CARD_TITLE", index.t("SKILL_NAME"), gramsOfProtein);
            const speechOutput = index.t('ADD_PROTEIN_MESSAGE', gramsOfProtein);

            index.emit(':tellWithCard', speechOutput, cardTitle);
        })})(this);
    },
    'HowMuchProtein': function () {
        const userId = this.event.session.user.userId;
        const date = this.event.request.intent.slots.Date.value || this.event.request.timestamp.slice(0, 10);


        (function read(index) {ProteinTracker.readGramsOfProtein(userId, date, function(err, result) {
            var gramsOfProtein = 0;
            if (result.Item.gramsOfProtein) {
                gramsOfProtein = result.Item.gramsOfProtein.N;
            }

            const cardTitle = index.t("HOW_MUCH_PROTEIN_TODAY_CARD_TITLE", index.t("SKILL_NAME"), gramsOfProtein);
            const speechOutput = index.t('HOW_MUCH_PROTEIN_TODAY_MESSAGE', gramsOfProtein);

            index.emit(':tellWithCard', speechOutput, cardTitle);
        })})(this);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const LANGUAGE_STRINGS = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Protein Tracker',
            WELCOME_MESSAGE: 'Welcome to %s, %s',
            HELP_MESSAGE: 'You can say add twenty grams of protein, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            ADD_PROTEIN_MESSAGE: "I\'ve added %s grams of protein to your log",
            ADD_PROTEIN_CARD_TITLE: "%s - %s grams added",
            HOW_MUCH_PROTEIN_TODAY_MESSAGE: "You've eaten %s grams of protein today",
            HOW_MUCH_PROTEIN_TODAY_CARD_TITLE: "%s - %s grams eaten today"
        },
    },
};