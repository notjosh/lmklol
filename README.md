# lmk.lol

it's _5:39pm_ here in _melbourne_, which is currently _12° and raining_. i was _54% productive_ yesterday, the last song i listened to was _PONPONPON_ and the last thing i watched was _Game of Thrones_. i apparently took _3,019 steps_ then slept for _six hours_. also all these api calls are broken LUL.

## Data

### Time

sample: 5:39pm

### Location

sample: Melbourne

### Weather

sample: 12° and raining

### Productivity

sample: 54% productive

### Last Song

sample: PONPONPON

### Last Show

sample: Game of Thrones

### Steps

sample: 3,019 steps

### Sleep

sample: six hours

## cURL to update data

### exist.io

```
curl -H "Authorization: Token [token]" https://exist.io/api/1/users/\$self/attributes/
```

### last.fm

```
curl 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=lemikizu&api_key=[api_key]&format=json'
```

### trakt.tv

```
curl --include \
     --header "Content-Type: application/json" \
     --header "trakt-api-version: 2" \
     --header "trakt-api-key: [client_id]" \
  'https://api.trakt.tv/users/lmk/history'
```