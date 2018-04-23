# import os
import json
import boto3
dynamodb = boto3.resource('dynamodb')


def handler(event, context):

    if 'id' not in event['pathParameters']:
        logging.error("Validation Failed")
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Invalid Channel Id'})
        }

        return response

    tableName = event['pathParameters']['id']
    
    try:

        table = dynamodb.Table(tableName)

        # fetch all messages from the channel
        result = table.scan()

        # create a response
        response = {
            "statusCode": 200,
            "body": json.dumps(result['Items'])
        }

        return response

    except:
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Channel does not exists'})
        }

        return response