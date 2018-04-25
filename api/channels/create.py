import json
import logging
import re
# import os
import time
# import uuid

import boto3
dynamodb = boto3.resource('dynamodb')


def handler(event, context):

    data = json.loads(event['body'])
    if 'name' not in data:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Channel Id'})
        }

        return response


    tableId = re.sub(r'[^A-Za-z0-9-]', '', re.sub(r'\s+', '-', data['name']).lower())

    try:
        table = dynamodb.create_table(
            TableName= tableId,
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'  #Partition key
                },
                {
                    'AttributeName': 'timestamp',
                    'KeyType': 'RANGE'  #Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'timestamp',
                    'AttributeType': 'S'
                },

            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10
            
            }
        )
    except:
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Channel already exists'})
        }

        return response

    time.sleep(5)

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps({'channel': tableId})
    }

    return response
