# import os
import json
import boto3
from datetime import datetime
dynamodb = boto3.resource('dynamodb')


def handler(event, context):

    if 'id' not in event['pathParameters']:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Channel Id'})
        }

    data = json.loads(event['body'])

    if all (k in data for k in ('text', 'email')):

        tableName = event['pathParameters']['id']
        try:

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
        except:
            response = {
                "statusCode": 403,
                "body": json.dumps({'error': 'Error retrieving data'})
            }

            return response

    else:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Email or Message'})
        }

        return response