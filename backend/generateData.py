from random import randint

import requests
from faker import Faker
from faker.providers import DynamicProvider

gender_provider = DynamicProvider(
    provider_name="gender",
    elements=["Male", "Female"],
)
fake = Faker()
fake.add_provider(gender_provider)


def createRecord(count):
    url = 'http://127.0.0.1:8000/users/'
    for _ in range(count):
        myobj = {
            "firstName": fake.first_name(),
            "lastName": fake.last_name(),
            "age": randint(20, 50),
            "gender": fake.gender(),
            "city": fake.city()
        }
        x = requests.post(url, json=myobj)
        print(x.text)


createRecord(5)
