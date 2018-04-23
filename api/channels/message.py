import json
import logging
import time
import uuid
from datetime import datetime

import boto3
dynamodb = boto3.resource('dynamodb')


def handler(event, context):

    if 'id' not in event['pathParameters']:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Channel Id'})
        }

    data = json.loads(event['body'])

    if 'text' and 'email' not in data:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Email or Message'})
        }

        return response

    tableName = event['pathParameters']['id']
    table = dynamodb.Table(tableName)

    item = {
        'email': str(data['email']),
        'timestamp':  datetime.now().isoformat(),
        'message': str(data['text'])
    }

    # write the message to the channel
    table.put_item(Item=item)

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps(item)
    }

    return response
