import os
import random
import json
import time
import string

with open('./password-wordlist.txt', 'r') as f:
    passwords = f.readlines()

with open('./domains.json', 'r') as f:
    email_domains = json.load(f)

with open('./first-names.txt', 'r') as f:
    first_names = f.readlines()

with open('./last-names.txt', 'r') as f:
    last_names = f.readlines()

def choice(lst):
    for _ in range(3): # Try 3 times
        v = random.choice(lst).strip()
        if v:
            return v
    raise Exception("No suitable choice found")

numbers = string.digits
letters = string.ascii_letters
def mutate_name(s) -> str:
    if random.random() < 0.5:
        s += ''.join(random.choices(numbers, k=random.randint(1,5)))

    if random.random() < 0.15:
        mutate_count = random.randint(1,1+len(s)//5)
        s = list(s)
        for _ in range(mutate_count):
            idx = random.randint(0, len(s)-1)
            s[idx] = choice(letters + numbers)
        s = ''.join(s)

    return s


def random_email() -> str:
    f_n = choice(first_names).strip()
    l_n = choice(last_names).strip()
    domain = choice(email_domains).strip()

    f_select = random.random()
    l_select = random.random()
    if f_select < 0.5:
        f_n = f_n[0] + '.'
        if l_select < 0.05:
            l_n = l_n[0]
    elif f_select < 0.75:
        f_n = ''
    else:
        if l_select < 0.5:
            l_n = l_n[0]
        elif l_select < 0.75:
            l_n = ''

    return f'{mutate_name(f_n + l_n)}@{domain}'



for _ in range(10):
    username = random_email()
    passwd = choice(passwords)
    print(username, mutate_name(passwd))
    command = f'curl -v -X POST https://rejoicing-device.000webhostapp.com/wp-includes/cla88.php -H "Content-Type: application/x-www-form-urlencoded" -d "AA={username}&BB={passwd}"'
    os.system(command)
    time.sleep(600 + random.random()*1800)
