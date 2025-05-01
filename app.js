const fromLanguage = document.querySelector("#fromLanguage");
const toLanguage = document.querySelector("#toLanguage");
const fromLan = document.querySelector("#fromLan");
const toLan = document.querySelector("#toLan");
const form = document.querySelector("#form");

function fillSelect() {
    languages.forEach((lan) => {
        const option = document.createElement("option");
        option.value = lan.code;
        option.innerText = lan.name;
        fromLanguage.appendChild(option);
        toLanguage.appendChild(option.cloneNode(true));
    });

    fromLanguage.value = "uz";
    toLanguage.value = "en";
}

fillSelect();

function speakText(textareaId) {
    const text = document.getElementById(textareaId).value;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = textareaId === "fromLan" ? fromLanguage.value : toLanguage.value;
        speechSynthesis.speak(utterance);
    }
}

async function fetchData(text, from, to) {
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        if (!res.ok) {
            throw new Error("Tarmoq javobi muvaffaqiyatsiz");
        }
        const data = await res.json();
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            throw new Error("Tarjima topilmadi");
        }
    } catch (error) {
        console.error("Ma'lumot olishda xatolik:", error);
        return "Tarjima qilishda xatolik yuz berdi.";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const from = fromLanguage.value;
    const to = toLanguage.value;
    const text = fromLan.value.trim();

    if (!text) {
        toLan.value = "Iltimos, matn kiriting.";
        return;
    }

    const translatedText = await fetchData(text, from, to);
    toLan.value = translatedText;
});