const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: 'us-east-1'});

function putGramsOfProtein(userId, date, gramsOfProtein, cb) {
    var params = {
        TableName: TABLE_NAME,
        Item: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            },
            'gramsOfProtein': {
                N: gramsOfProtein
            }
        }
    };
    this.dynamodb.putItem(params, cb);
}

function readGramsOfProtein(userId, date, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        ProjectionExpression: 'gramsOfProtein'
    };
    this.dynamodb.getItem(params, cb);
}

function updateGramsOfProtein(userId, date, gramsOfProtein, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        UpdateExpression: 'ADD gramsOfProtein :gramsOfProtein',
        ExpressionAttributeValues: {
            ':gramsOfProtein': {'N': gramsOfProtein}
        },
        ReturnValues: 'ALL_NEW'
    };
    this.dynamodb.updateItem(params, cb);
}

function deleteGramsOfProtein(userId, date, cb) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            'userId': {
                S: userId
            },
            'date': {
                S: date
            }
        },
        ConditionExpression: 'attribute_exists(gramsOfProtein)',
        ReturnValues: 'ALL_OLD'
    };
    this.dynamodb.deleteItem(params, cb);
}

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