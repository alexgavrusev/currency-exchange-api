# Interview Assignment - Backend developer - Currency Exchange rates

Create a Currency Exchange API that will leverage another API for currency exchange rates.

- The API will be written in TypeScript and run on NodeJS, bonus if it uses the NextJS framework.
- This is not a hackathon. We are looking for a solution that would be long-term maintainable and not hacky, we are evaluating the attention to detail. Think about the next person that would be new to this codebase and should continue with the work.
- Use the json structure provided.
- Test coverage is also a valid plus.
- Use git, we also prefer to read through nice commit history.
- Publish this code on your git repository, it has to be publically available, then send us a link.
- Work with the results of [currency-exchange](https://rapidapi.com/fyhao/api/currency-exchange/) API  
Here is your API key for RapidAPI: `X-RapidAPI-Key: 5c40b1f0d7msh16bd9999dee7042p1ad946jsn982ef6081bdb`
- The only valid currencies are those that are returned from `/listquotes` endpoint and `CZK`, any other value should be treated as invalid.
- Consider that input might not be valid, responses can be invalid, the currency-exchange API might not be available too. Employ defensive programming.


## API endpoints

These are the endpoints you will create:


### MinMax

GET `/minmax`

- An endpoint will return the lowest and highest exchange rate.

#### Response example

```json
{
    "min": {
        "currency": "AUD",
        "exchangeRate": 16.58
    },
    "max": {
        "currency": "EUR",
        "exchangeRate": 24.71
    }
}
```


### Results

GET `/results?currency=czk`

- JSON result of currency conversion.
- query param `currency` will determine the currency to convert to.
- if currency query param is not provided, the default currency will be `CZK`.
> The currencies will be sorted in descending order, from highest value in CZK to lowest.

#### Response example

```json
[
    "1. 1 EUR -> 24.71 CZK",
    "2. 1 USD -> 22.42 CZK",
    "15. 1 AUD -> 16.58 CZK"
]
```


### Export

GET `/results/export?currency=czk`
- query param `currency` will determine the currency to convert to.
- if currency query param is not provided, the default currency will be `CZK`.
- An endpoint that will download a `.txt` file with the current exchange rate.
- the last result will not have a comma `,` at the end of the line.
> The currencies will be sorted in descending order, from highest value in CZK to lowest.

#### Response example

```txt
1. 1 EUR -> 24.71 CZK,
2. 1 USD -> 22.42 CZK,
//...
15. 1 AUD -> 16.58 CZK
```


### Convert

POST `/convert`
- We post JSON body to 

#### Request example

```json
[
   {
      "from":{
         "currency":"EUR",
         "quantity":2
      },
      "to":"CZK"
   },
   {
      "from":{
         "currency":"USD",
         "quantity":4
      },
      "to":"AUD"
   }
]
```

#### Response example

```json
[
    "2 EUR - CZK -> 49.42",
    "4 USD - AUD -> 5,41"
]
```


## Documentation

- Create a README.md for the project, where you describe how to install and run it.
