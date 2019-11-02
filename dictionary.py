# coding=utf-8
from tkinter import Frame, Entry, Button, W, BooleanVar, Checkbutton, Label, \
    Text, WORD, S, END, Tk, OptionMenu, StringVar
from datetime import datetime


class Application(Frame):
    """ Create GUI for dictionary """
    def __init__(self, master):
        super(Application, self).__init__(master)
        self.grid(padx = 5, pady = 5)
        self.VOWELS = ['а', 'е', 'є', 'и', 'і', 'ї', 'о', 'у', 'ю', 'я']
        self.DICTIONARIES = ["Інверсійний словник української мови",
                             "Орфографический словарь В.В. Лопатина"]
        self.DICT_FILES = ["data/processed/dictionary_ua.txt",
                           "data/processed/Lopatin.txt"]
        self.create_widgets()

    def create_widgets(self):
        """ Create all widgets for application """
        # search area
        self.search_area = Entry(self, width = 42)
        self.search_area.grid(row = 0, column = 1, sticky = W, padx = 10)

        # search button
        Button(self,
               text = "Пошук",
               command = self.search
               ).grid(row = 0, column = 2, sticky = W)

        # (1) check button only end of word
        self.at_end = BooleanVar()
        Checkbutton(self,
                    text = "шукати лише наприкінці слова",
                    variable = self.at_end
                    ).grid(row = 1, column = 1, sticky = W, padx = 5)

        # (2) check button and text area number of syllables
        self.syllables = BooleanVar()
        Checkbutton(self,
                    text = "кількість складів",
                    variable = self.syllables
                    ).grid(row = 2, column = 1, sticky = W, padx = 5)
        self.numb_of_syllables = Entry(self, width = 2)
        self.numb_of_syllables.grid(row = 2, column = 2, sticky = W)

        # (3) check button only consonants after phrase
        self.consonants = BooleanVar()
        Checkbutton(self,
                    text = "лише приголосні після буквосполучення",
                    variable = self.consonants
                    ).grid(row = 3, column = 1, sticky = W, padx = 5)

        # (4) check button and text area on what phrase ends
        self.phrase = BooleanVar()
        Checkbutton(self,
                    text = " слово закінчується на буквосполучення",
                    variable = self.phrase
                    ).grid(row = 4, column = 1, sticky = W, padx = 5)
        self.in_phrase = Entry(self, width = 4)
        self.in_phrase.grid(row = 4, column = 2, sticky = W)

        # (5) check button vowels after phrase
        self.vowels_after = BooleanVar()
        Checkbutton(self,
                    text = "після буквосполучення є така(і) голосна(і)",
                    variable = self.vowels_after
                    ).grid(row = 5, column = 1, sticky = W, padx = 5)
        self.vowels = Entry(self, width = 4)
        self.vowels.grid(row = 5, column = 2, sticky = W)

        self.optionmenu_value = StringVar(self)
        self.optionmenu_value.set(self.DICTIONARIES[0])  # default value
        self.optionmenu = OptionMenu(
            self, self.optionmenu_value, *self.DICTIONARIES)
        self.optionmenu.grid(row=6, column=1, columnspan=2)

        # copyright
        Label(self,
              text = "Copyright © " + str(datetime.today().year) + ", Misha Kushka,"
              ).grid(row = 9, column = 1, columnspan = 2, sticky = S)
        Label(self,
              text = "All Rights Reserved"
              ).grid(row = 10, column = 1, columnspan = 2, sticky = S)

        # output text area
        self.textarea = Text(self, width = 32, height = 14, wrap = WORD)
        self.textarea.grid(row = 0, column = 0, rowspan = 10, sticky = W)

        # total finded
        self.total_find = Label(self, text = "Усього: 0")
        self.total_find.grid(row = 10, column = 0)

    """def open_file(self, file_name, mod):
        "" Try open file and die error if can't ""
        try:
            file = open(file_name, mod, encoding = 'utf-8')
            return file
        except:
            error_message = "На жаль, словник не може зв'язатися з базою данних."
            self.textarea.delete(0.0, END)
            self.textarea.insert(0.0, error_message)
            return"""

    def search(self):
        """ Search phrase in the dictionary using options"""
        index = self.DICTIONARIES.index(self.optionmenu_value.get())
        dictionary = open(self.DICT_FILES[index], "r", encoding = 'utf-8')
        
        # preparation for search
        in_phrase = self.search_area.get()
        self.textarea.delete(0.0, END)
        words = []
        for line in dictionary:
            words.append(line)

        # (1) phrase must be at the end of the word
        if self.at_end.get():
            in_phrase += "\n"
            
        # (2) phrase must have given number of syllables
        if self.syllables.get():
             self.numb_of_syll = int(self.numb_of_syllables.get())
             new_words = []
             for word in words:
                 counter = 0
                 for letter in word:
                     if letter in self.VOWELS:
                         counter += 1
                 if counter == self.numb_of_syll:
                     new_words.append(word)
             words = new_words

        # (3) only consonants after phrase
        if self.consonants.get():
            new_words = []
            for word in words:
                if in_phrase in word:
                    cut = word.rindex(in_phrase) + len(in_phrase)
                    counter = 0
                    s = word[cut:]
                    if s == "\n":
                        new_words.append(word)
                    else:
                        for letter in self.VOWELS:
                            if s.find(letter) == -1:
                                counter += 1
                        if counter == len(self.VOWELS):
                            new_words.append(word)                       
            words = new_words

        # (4) on what phrase ends
        if self.phrase.get():
            new_words = []
            substr = self.in_phrase.get()
            for word in words:
                if in_phrase in word:
                    if len(word) == word.rfind(substr) + len(substr) + 1:
                        new_words.append(word)
            words = new_words

        # (5) vowels after phrase
        if self.vowels_after.get():
            new_words = []
            vowels = self.vowels.get().split(" ")
            for word in words:
                if in_phrase in word:
                    cut = word.index(in_phrase) + len(in_phrase)
                    s = word[cut:]
                    counter = 0
                    for vowel in self.VOWELS:
                            counter += s.count(vowel)
                    if counter == len(vowels):
                        if s != "\n":
                            counter = 0
                            for vowel in vowels:
                                if s.find(vowel) != -1:
                                    cut = s.index(vowel) + 1
                                    s = s[cut:]
                                    counter += 1
                            if counter == len(vowels):
                                new_words.append(word)
            words = new_words
            
        # simple search
        elements = 0
        for word in words:
            if in_phrase in word:
                self.textarea.insert(END, word)
                elements += 1
        self.total_find["text"] = "Усього: " + str(elements)
            

def main():
    root = Tk()
    root.title("Інверсійний словник")
    Application(root)
    root.mainloop()


main()
