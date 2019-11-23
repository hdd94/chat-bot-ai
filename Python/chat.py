from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot
import os
import sys
sys.prefix ="virtualenv/lib/python3.7"
bot = ChatBot('Test')
def chat():
    return bot.get_response(sys.argv[1])
if __name__ == '__main__':
    var = chat()
    print(var)




