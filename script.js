// import fetch from 'cross-fetch';
// import { xml2json } from './xml-js';


const URL = 'https://d203uamca1bsc4.cloudfront.net/app/';

const stationTemplate = document.querySelector("[data-station-template]")
const stationContainer = document.querySelector("[data-stations-list-container]")
const divStation = document.querySelector(".station")
const audioP = document.querySelector('#player');
const playingName = document.querySelector('#playing-name');
const playingSong = document.querySelector('#playing-song');


function loadDataStation(dataArt, dataSongName, url) {
    const infos = fetch(url)
    infos.then(res => res.text()).then(data => {
        try {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "application/xml");
            var nowArtist = xml.getElementsByTagName("artist")[0].childNodes[0].nodeValue
            var nowName = xml.getElementsByTagName("name")[0].childNodes[0].nodeValue
        } catch {

        }

        if (nowArtist == 'undefined' || !nowArtist || nowArtist == 'Unknown' || nowArtist == '-')
            nowArtist = '100FM'
        if (nowName == 'undefined' || !nowName || nowName == 'Unknown' || nowName == '-')
            nowName = '100FM'

        dataArt.innerText = nowArtist
        dataSongName.innerText = nowName
    })
}


function buildStation(data) {
    var res = data['stations']
    for (let i = 0; i < res.length; i++) {
        const name = res[i]['name']
        const audio = res[i]['audio']
        const cover = res[i]['cover']
        const desc = res[i]['description']
        const stations = [{ 'audio': res[i]['audio'], 'info': res[i]['info'] }]

        if (res[i]['sliders'] !== undefined) {
            for (let j = 0; j < res[i]['sliders'].length; j++) {
                stations.push({ 'audio': res[i]['sliders'][j]['audio'], 'info': res[i]['sliders'][j]['info'] })
            }
        }

        const card = stationTemplate.content.cloneNode(true).children[0]
        const dataCover = card.querySelector("[data-cover]")
        const coverImg = document.createElement("img")
        coverImg.setAttribute("src", cover);
        dataCover.append(coverImg)
        const dataName = card.querySelector("[data-name]")
        dataName.textContent = name
        const dataDesc = card.querySelector("[data-desc]")
        dataDesc.textContent = desc
        const dataPlaying = card.querySelector("[data-channel]")

        if (i == 0) {
            const dataArt = document.createElement("span")
            dataArt.innerText = "100FM Live!"
            dataArt.setAttribute("class", 'artist')
            const dataSongName = document.createElement("span")
            dataSongName.innerText = "100FM בשידור חי!"
            dataSongName.setAttribute("class", 'song')


            const dataChannel = document.createElement("div")
            dataChannel.setAttribute("class", "play")
            dataChannel.append(dataArt, dataSongName)
            dataPlaying.append(dataChannel)
            dataChannel.addEventListener('click', () => {
                audioP.pause()
                audioP.setAttribute('src', stations[i]['audio'])
                playingName.innerText = dataArt.innerText
                playingSong.innerText = dataSongName.innerText
                audioP.play()
            })
        }

        for (let j = 0; j < stations.length; j++) {
            var url = stations[j]['info']

            const dataArt = document.createElement("span")
            dataArt.setAttribute("class", 'artist')
            const dataSongName = document.createElement("span")
            dataSongName.setAttribute("class", 'song')
            const dataChannel = document.createElement("div")
            dataChannel.setAttribute("class", "play")
            var audioElement = document.createElement('audio');
            audioElement.setAttribute("src", stations[j]['audio'])
            dataChannel.append(dataArt, dataSongName, audioElement)
            dataPlaying.append(dataChannel)
            dataChannel.addEventListener('click', () => {
                audioP.pause()
                audioP.setAttribute('src', stations[j]['audio'])
                playingName.innerText = dataArt.innerText
                playingSong.innerText = dataSongName.innerText
                audioP.play()
            })
            loadDataStation(dataArt, dataSongName, url)
            setInterval(loadDataStation, 60000, dataArt, dataSongName, url)
        }
        stationContainer.append(card)
    }
}

const data = fetch(URL);
data.then(res => res.json()).then(buildStation);