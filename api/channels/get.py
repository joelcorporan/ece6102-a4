# import os
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime

dynamodb = boto3.client('dynamodb')


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

        response = dynamodb.describe_table(TableName=tableName)

        # create a response
        response = {
            "statusCode": 204
        }

        return response

    except Exception as e:
        print(e)
        response = {
            "statusCode": 403,
            "body": json.dumps({'error': 'Channel does not exists'})
        }

        return response