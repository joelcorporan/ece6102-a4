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

0. Users should sign in with a google account before adding a channel, sending or seeing a message in the chatroom. No chats should be visible without signing in.

1. There should be a way for the user to create a channel through the interface.


2. Users should be able to send a message on any existing channel.

3. It should be possible to switch between channels seamlessly through the user interface.

4. The delay in message exchange should be minimal.

5. There should be a way for the user to determine the channel he/she is sending a message on.

6. There should be a way for any user to determine the sender of a message. Furthermore, user’s messages should be distinguishable from other messages. 

7. The user should be able to see the complete history of a channel.

8. There should be a way for the user to search for a channel among the existing channels.

9. The use of  WebSocket (STATEFUL) Connections is prohibited. Only HTTP (STATELESS) connections allow.

10. The content should be only rendered once, and web should use poling for new update.

11. IMPORTANT! A user should, under no condition, miss a message. Furthermore, the order of messages should be the same on every user’s machine. The implementation CANNOT BE refreshing the page.

# 3. System Diagram

## System Architecture ![](https://github.com/joelcorporan/ece6102-a4/blob/master/img/sys.png)
## Item in DynamoDB Table ![](https://github.com/joelcorporan/ece6102-a4/blob/master/img/table.png)

# 4 Demo Videos

Create Channel 
https://www.youtube.com/watch?v=LqyYE_oJDgI

Search Channel
https://www.youtube.com/watch?v=KcQI7bp83UU

ChatRoom
https://www.youtube.com/watch?v=VJIgaSs0AGs

