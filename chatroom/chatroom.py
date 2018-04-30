#!/usr/bin/env python

# [START imports]
import os
import urllib
import json
import logging
import pytz

from datetime import datetime, timedelta
from google.appengine.api import users, urlfetch
from google.appengine.ext import ndb

import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

# [END imports]

API_ENDPOINT = 'https://c5yaek0b1l.execute-api.us-east-1.amazonaws.com/dev/v2/'

def getMessages(channel):
    """Return the messages on a channel.

    """
    try:
        url = "%schannels/%s/messages" % (API_ENDPOINT, channel)

        urlfetch.set_default_fetch_deadline(30)

        result = urlfetch.fetch(url)

        if result.status_code == 200:
            return (None, sorted(json.loads(result.content), key=lambda x : x['timestamp']))
        else:
            return (result.status_code, None)

    except urlfetch.Error as error:
        logging.exception('Caught exception fetching url')
        return (error, None)

def publishMessage(channel, email, message):
    """Publish messages on a channel.

    """
    try:
        data = json.dumps({'email': email, 'text': message})
        headers = {'Content-Type': 'application/json'}

        urlfetch.set_default_fetch_deadline(30)

        result = urlfetch.fetch(
                    url = "%schannels/%s/messages" % (API_ENDPOINT, channel),
                    payload = data,
                    method = urlfetch.POST,
                    headers = headers
                )

        if result.status_code == 200:
            return (None, json.loads(result.content))
        else:
            return (result.status_code, None)

    except urlfetch.Error as error:
        logging.exception('Caught exception fetching url')
        return (error, None)

def setChannel(channel):
    """Create a new channel.

    """
    try:
        data = json.dumps({'name': channel})
        headers = {'Content-Type': 'application/json'}

        urlfetch.set_default_fetch_deadline(30)

        result = urlfetch.fetch(
            url = "%schannels" % (API_ENDPOINT),
            payload = data,
            method = urlfetch.POST,
            headers = headers
        )

        if result.status_code == 200:
            return (None, json.loads(result.content))
        else:
            return (result.status_code, None)

    except urlfetch.Error as error:
        logging.exception('Caught exception fetching url')
        return (error, None)

def getChannel(channel):
    """Get channel.

    """
    try:
        urlfetch.set_default_fetch_deadline(30)

        result = urlfetch.fetch(
            url = "%schannels/%s" % (API_ENDPOINT, channel),
            method = urlfetch.GET
        )

        if result.status_code == 204:
            return (None, channel)
        else:
            return (result.status_code, None)

    except urlfetch.Error as error:
        logging.exception('Caught exception fetching url')
        return (error, None)

def getUser(uri):
    """Return the current user.

    """
    user = users.get_current_user()

    if user:
        url = users.create_logout_url(uri)
        url_linktext = 'Logout'
    else:
        url = users.create_login_url(uri)
        url_linktext = 'Login'

    return (user, url, url_linktext)

def getCurrentChannels(user):
    """Return the current Channels.

    """
    channels_query = Chatroom.query(ancestor=chatroom_key(user.email()))
    channels = channels_query.fetch()

    return [channel.channel for channel in channels]

def chatroom_key(email):
    """Constructs a Datastore key for a Chatroom entity.

    We use chatroom_key as the key.
    """
    return ndb.Key('email', email)

# [START Chatroom]
class Chatroom(ndb.Model):
    """Sub model for representing an Chatroom."""
    channel = ndb.StringProperty(indexed=True)
    created = ndb.DateTimeProperty(auto_now_add=True)
# [END greeting]


# [START MainPage]
class MainPage(webapp2.RequestHandler):

    def get(self):
        user = getUser(self.request.uri)

        template_values = {
            'user': user[0],
            'url': user[1],
            'url_linktext': user[2],
        }

        if user[0]:
            self.redirect('/channels')


        template = JINJA_ENVIRONMENT.get_template('chatroom.html')
        self.response.write(template.render(template_values))
# [END MainPage]

# [START Channels]
class Channels(webapp2.RequestHandler):

    def get(self):
        user = getUser(self.request.uri)

        template_values = {
            'user': user[0],
            'url': user[1],
            'url_linktext': user[2],
        }

        if user[0]:
            template_values['channels'] = getCurrentChannels(user[0])

        template = JINJA_ENVIRONMENT.get_template('chatroom.html')
        self.response.write(template.render(template_values))
# [END Channels]

# [START Channel]
class Channel(webapp2.RequestHandler):
    def get(self, channel):
        result = getMessages(channel)

        user = getUser(self.request.uri)

        if user[0]:

            if result[0] is None:
                messages = result[1]

                template_values = {
                    'user': user[0],
                    'url': user[1],
                    'email': user[0].email(),
                    'currentChannel': channel,
                    'messages': messages,
                    'url_linktext': user[2],
                }

                if user[0]:
                    template_values['channels'] = getCurrentChannels(user[0])

                template = JINJA_ENVIRONMENT.get_template('chatroom.html')
                self.response.write(template.render(template_values))

            else:
                result = getChannel(channel)

                if result[0] is not None:
                    self.redirect('/channels')
        else:
            self.redirect('/')
# [END Channel]

# [START Search]
class Search(webapp2.RequestHandler):

    def get(self):
        channel = self.request.get('channel')
        result = getChannel(channel)

        user = users.get_current_user()

        if user:
            if result[0] is None and channel not in getCurrentChannels(user):

                key = user.email()
                chatroom = Chatroom(parent=chatroom_key(key))
                chatroom.channel = channel
                chatroom.put()

                self.response.write(channel)
            else:
                self.abort(403)
                self.response.write('empty')
        else:
            self.abort(403)
            self.response.write('empty')
# [END Search]

class Messages(webapp2.RequestHandler):

    def get(self, channel):
        query = dict(self.request.GET.items())

        result = getMessages(channel)
        user = users.get_current_user()

        if user:
            if result[0] is None:
                messages = result[1]

                print(len(messages), int(query['current']), len(messages) != int(query['current']), query['time'])

                if len(messages) > int(query['current']):
                    email = user.email()
                    time = query['time']
                    print(email, time)
                    index = next((index for (index, d) in enumerate(messages) if d["timestamp"] == time), None)

                    if index is not None:
                        newMessages = messages[index + 1:]

                        if len(messages) == (int(query['current']) + len(newMessages)):
                            newMessages = messages[index + 1:]
                            self.response.write(json.dumps(newMessages))

                        else:
                            self.response.headers.add("remaining", len(messages))
                            self.response.set_status(409)
                            self.response.write([])

                    else:
                        self.response.headers.add("remaining", len(messages))
                        self.response.set_status(409)
                        self.response.write([])
                else:
                    self.response.write([])
        else:
            self.response.write([])

    def post(self, channel):
        user = users.get_current_user()

        if user:
            email = user.email()
            body = json.loads(self.request.body)

            result = publishMessage(channel, email, body['text'])

            if result[0] is None:
                self.response.write(json.dumps(result[1]))

            else:
                self.abort(403)
                self.response.write('empty')

# [START SetChannel]
class SetChannel(webapp2.RequestHandler):

    def get(self):
        user = getUser(self.request.uri)

        template_values = {
            'user': user[0],
            'url': user[1],
            'url_linktext': user[2],
        }

        template = JINJA_ENVIRONMENT.get_template('create.html')
        self.response.write(template.render(template_values))

    def post(self):
        
        request = json.loads(self.request.body)
        channel = request['name']

        result = setChannel(channel)

        user = users.get_current_user()

        if user:
            if result[0] is None:

                key = user.email()
                chatroom = Chatroom(parent=chatroom_key(key))
                chatroom.channel = result[1]['channel']
                chatroom.put()

                self.response.write(json.dumps({'channel': result[1]['channel']}))
            else:
                self.abort(403)
                self.response.write('empty')
        else:
            self.abort(403)
            self.response.write('empty')

# [END SetChannel]

# Filters
def format_datetime(value, format='medium'):
    date = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")
    date = date.replace(tzinfo=pytz.UTC)
    date = date.astimezone(pytz.timezone('US/Eastern'))

    return date.strftime("%-I:%M %p")

def format_gap(time1, time2):
    date1 = datetime.strptime(time1, "%Y-%m-%dT%H:%M:%S.%f")
    date1 = date1.replace(tzinfo=pytz.UTC)
    date1 = date1.astimezone(pytz.timezone('US/Eastern'))

    date2 = datetime.strptime(time2, "%Y-%m-%dT%H:%M:%S.%f")
    date2 = date2.replace(tzinfo=pytz.UTC)
    date2 = date2.astimezone(pytz.timezone('US/Eastern'))

    diff = abs(date2 - date1)

    print(diff, diff > timedelta(minutes=60))

    if diff > timedelta(minutes=60):
        return "Today at %s" % (date2.strftime("%-I:%M %p"))
    else:
        return False

JINJA_ENVIRONMENT.filters['datetime'] = format_datetime
JINJA_ENVIRONMENT.filters['gap'] = format_gap

# [START app]
app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/channels', Channels),
    ('/channels/(\w+)', Channel),
    ('/search', Search),
    ('/channels/(\w+)/messages', Messages),
    ('/create', SetChannel),
], debug=True)
# [END app]
