# ECE 6102 - A4

+ This project was designed for future ECE 6102 students to get the basic concept on AWS services.

+ The ideas is implementing chatroom with lambda function and Dynamo DB.

Use [boto3](https://boto3.readthedocs.io/en/latest/) for modifying Dynamo tables and [serverless](https://serverless.com) for minimizing the environment set up overhead for lambda functions.

## Part1

1.  Create AWS account (IAM).
2.  Host the template on Google Cloud.

## Part2

We will use google cloud app engine to deploy the server.
The templates will be provided.

# 1. Implement followings lambda APIs

## Check Channel Status (GET)
### URL/channels/{id}

Check the existence of the channel.

## Create Channel (POST)
### URL/channels
Creat a new channel

```
{
	"name" : "{New Channel Name}"

}
```


## Get all Messages (GET)
### URL/channels/{id}/messages

Get all the messages corresponding to the specific channel


## Publish a Message (POST)
### URL/channels/{id}/messages

Publish a message to a channel

```
{
	"email" : "{Email}",
	"text" : "{TEXT}"
}
```

# 2. Create a chat room service

After signing in, the user can see his/her chat channels. 

## requirement:

0. User should sign in with email to start the service

1. NDB models can be used to store "user : list of channels" pairs.

2. Each Channel should map to 1 DyanamoDB table.

3. There should be a way to creat a channel table in the UI.

4. There should be a way to store/send a message to a channel.

# 3. System Diagram

![](https://github.com/joelcorporan/ece6102-a4/blob/master/img/p4.png)

# 4 Demo Videos

Create Channel 
https://www.youtube.com/watch?v=LqyYE_oJDgI

Search Channel
https://www.youtube.com/watch?v=KcQI7bp83UU

ChatRoom
https://www.youtube.com/watch?v=VJIgaSs0AGs

