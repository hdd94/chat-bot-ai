import nltk
import sys
sys.path.append("virtualenv/lib/python3.7/site-packages")
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import os
nltk.download()

bot = ChatBot('Test')


def init():
    for file in os.listdir("Python/Training"):
        if file.endswith(".txt"):
            conv = open('Python/Training/' + file, 'r').readlines()
    trainer = ListTrainer(bot)
    trainer.train(conv)
    return("Chats loaded")


def chat():
    return bot.get_response("message")


if __name__ == '__main__':
    var = init()
    print(var)
