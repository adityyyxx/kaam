import { YoutubeTranscript } from 'youtube-transcript';


// export function extractVideoId(url: string): string | null {
//     const regex =
//         /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
// }


async function getTranscript(videoId: string) {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return transcript
        .map((t) => t.text)
        .join(' ');
}

function chunkText(text: string, chunkSize = 2000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }


console.log((await getTranscript("https://youtu.be/pBj9ziOE8OQ?si=KshtV73lsnCanFaa")));
  
