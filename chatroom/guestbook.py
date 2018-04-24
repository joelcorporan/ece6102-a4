#!/usr/bin/env python

# [START imports]
import os
import urllib
import json
import logging

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

def getUser(uri):
    user = users.get_current_user()

    if user:
        url = users.create_logout_url(uri)
        url_linktext = 'Logout'
    else:
        url = users.create_login_url(uri)
        url_linktext = 'Login'

    return (user, url, url_linktext)

def getCurrentChannels(entities):
    """Return the current Channels.

    """
    return list(set(map(lambda key: key.parent().id().decode('utf_8'), entities)))

def getMessages(channel):
    """Return the messages on a channel.

    """
    try:
        url = "%schannels/%s/messages" % (API_ENDPOINT, channel)
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

        result = urlfetch.fetch(
                    url = "%s/channels/%s/messages" % (API_ENDPOINT, channel),
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

def chatroom_key(chatroom):
    """Constructs a Datastore key for a Chatroom entity.

    We use chatroom_key as the key.
    """
    return ndb.Key('channel', chatroom)

# [START Chatroom]
class Chatroom(ndb.Model):
    """Sub model for representing an Chatroom."""
    name = ndb.StringProperty(indexed=False)
    created = ndb.DateTimeProperty(auto_now_add=True)
# [END greeting]


# [START main_page]
class MainPage(webapp2.RequestHandler):

    def get(self):
        user = getUser(self.request.uri)

        # print()

        template_values = {
            'user': user[0],
            'channels': getCurrentChannels(Chatroom.query().fetch(keys_only=True)),
            'url': user[1],
            'url_linktext': user[2],
        }

        template = JINJA_ENVIRONMENT.get_template('chatroom.html')
        self.response.write(template.render(template_values))

# [END main_page]

# [START Search]

class Search(webapp2.RequestHandler):

    def get(self):
        user = getUser(self.request.uri)

        template_values = {
            'user': user[0],
            'channels': getCurrentChannels(Chatroom.query().fetch(keys_only=True)),
            'url': user[1],
            'url_linktext': user[2],
        }

        template = JINJA_ENVIRONMENT.get_template('search.html')
        self.response.write(template.render(template_values))

# [END Search]


# [START guestbook]
class Guestbook(webapp2.RequestHandler):

    def post(self):
        # We set the same parent key on the 'Greeting' to ensure each
        # Greeting is in the same entity group. Queries across the
        # single entity group will be consistent. However, the write
        # rate to a single entity group should be limited to
        # ~1/second.
        guestbook_name = self.request.get('guestbook_name',
                                          DEFAULT_GUESTBOOK_NAME)
        greeting = Greeting(parent=guestbook_key(guestbook_name))

        if users.get_current_user():
            greeting.author = Author(
                    identity=users.get_current_user().user_id(),
                    email=users.get_current_user().email())

        greeting.content = self.request.get('content')
        greeting.put()

        query_params = {'guestbook_name': guestbook_name}
        self.redirect('/?' + urllib.urlencode(query_params))


# channel API

class Channels(webapp2.RequestHandler):

    def get(self, channel):
        result = getMessages(channel)

        if result[0] is None:
            messages = result[1]
        else:
            messages = None

        user = users.get_current_user()

        print(user.email())
        if user:
            # need to query the channel data for that user

            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
    

        template_values = {
            'user': user,
            'channel': channel,
            'messages': messages,
            'url_linktext': url_linktext,
        }

        template = JINJA_ENVIRONMENT.get_template('chatroom.html')
        self.response.write(template.render(template_values))

    def post(self, channel):
        pass


class DisplayChannelID(webapp2.RequestHandler):

    def get(self, channel_id):
        
        print(channel_id)
        user = users.get_current_user()
        if user:
            # need to query the channel data for that user

            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
    

        template_values = {
            'user': user,
            'url_linktext': url_linktext,
            'active_chat' : channel_id,
        }

        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))





# [END guestbook]






# [START app]
app = webapp2.WSGIApplication([
    ('/', MainPage),
    # ('/sign', Guestbook),
    # ('/channels', Channels),
    ('/channels/(\S+)', Channels),
    ('/search', Search)
], debug=True)
# [END app]
