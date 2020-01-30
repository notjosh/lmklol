# lmk.lol

it’s \<time\> here in melbourne, which is currently \<temperature\> and \<weather-description\>. the last song i listened to was \<song\> by \<artist\>, the last thing i watched was \<trakt\> and the last game i played was \<steam\>. yesterday i was \<productivity\> productive and i took \<stepcount\> steps before sleeping for \<sleep\>.

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
