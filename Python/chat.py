import sys
sys.path.append("virtualenv/lib/python3.7/site-packages")
import os
from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot

bot = ChatBot('Test')


def chat():
    return bot.get_response(sys.argv[1])


if __name__ == '__main__':
    var = chat()
    print(var)
