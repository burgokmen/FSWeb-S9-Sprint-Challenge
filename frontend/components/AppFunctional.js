import { axios } from "axios";
import React, { useState } from "react";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const xIndex = (index % 3) + 1;
    const yIndex = Math.floor(index / 3) + 1;
    return { xIndex, yIndex };
  }
  /* time 0 x 1 y 1
  time 1 x 2 y 1
  time 2 x 3 y 1 */

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const { xIndex, yIndex } = getXY();
    const currentMessage = `Koordinatlar (${xIndex}, ${yIndex})`;
    return currentMessage;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    let newIndex = index;
    let { xIndex, yIndex } = getXY();
    if (yon === "left" && xIndex > 1) {
      return (newIndex -= 1);
    }
    if (yon === "up" && yIndex > 1) {
      return (newIndex -= 3);
    }
    if (yon === "right" && xIndex < 3) {
      return (newIndex += 1);
    }
    if (yon === "down" && yIndex < 3) {
      return (newIndex += 3);
    }

    return newIndex;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.

    const yon = evt.target.id;
    const newIndex = sonrakiIndex(yon);
    let currentSteps = index !== newIndex ? steps + 1 : steps;
    if (index === newIndex) {
      const yonMessage = `${yon} tarafa gidemezsin `;
      setMessage(yonMessage);
      setInterval(() => setMessage("Bru Grid iftiharla sunar"), 5000);
      // Ask! Burda bi kac ilerlettikten sonra direk bu yaziya donuyor, bunu sor.
    }
    setSteps(currentSteps);
    setIndex(newIndex);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    console.log("submit edildi");
    let { xIndex, yIndex } = getXY();
    const payload = {
      xIndex: xIndex,
      yIndex: yIndex,
      email: email,
      steps: steps,
    };

    axios
      .post("http://localhost:9000/api/result", payload)
      .then(function (response) {
        console.dog(response.data);
        setMessage(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left">
          SOL
        </button>
        <button onClick={ilerle} id="up">
          YUKARI
        </button>
        <button onClick={ilerle} id="right">
          SAĞ
        </button>
        <button onClick={ilerle} id="down">
          AŞAĞI
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          id="email"
          type="email"
          placeholder="email girin"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
