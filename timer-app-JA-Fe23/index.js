document.addEventListener("DOMContentLoaded", function () {
  // Vänta tills hela sidan har laddats innan koden körs

  // Navigera från loading-skärmen till set-timer.html
  const logoElement = document.querySelector(".logo");
  if (logoElement) {
    // Om logotypen hittas, lägg till en klickhändelse för att gå till "Set Timer"-vyn
    logoElement.addEventListener("click", function () {
      window.location.href = "set-timer.html";
    });
  }

  // Hantering av Start Timer-knappen i Set Timer-vyn
  const startTimerBtn = document.getElementById("start-timer-btn");
  if (startTimerBtn) {
    // Om "Start Timer"-knappen hittas, lägg till en klickhändelse för att starta timern
    startTimerBtn.addEventListener("click", function () {
      const minutes = parseInt(document.getElementById("minutes").value);
      // Kontrollera om inmatningen är ett giltigt antal minuter
      if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes."); // Visa ett felmeddelande om ogiltig inmatning
        return;
      }
      const totalSeconds = minutes * 60;

      // Spara total tid i sekunder i localStorage för användning i andra vyer
      localStorage.setItem("remainingSeconds", totalSeconds);

      // Navigera till Analog Timer-vyn som standard
      window.location.href = "analog-timer.html";
    });
  }

  // Navigera mellan Analog och Digital Timer
  const toAnalogLink = document.getElementById("to-analog");
  const toDigitalLink = document.getElementById("to-digital");

  if (toAnalogLink) {
    // Om länken till Analog Timer hittas, lägg till en klickhändelse för att växla till den
    toAnalogLink.addEventListener("click", function () {
      window.location.href = "analog-timer.html";
    });
  }

  if (toDigitalLink) {
    // Om länken till Digital Timer hittas, lägg till en klickhändelse för att växla till den
    toDigitalLink.addEventListener("click", function () {
      window.location.href = "digital-timer.html";
    });
  }

  // Hantering av den analoga timern
  const analogTimerSetup = () => {
    const cancelTimerBtn = document.getElementById("cancel-timer-btn");
    if (!cancelTimerBtn) return; // Avbryt om avbrytknappen inte hittas

    // Läs av kvarvarande sekunder från localStorage
    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));

    // Kontrollera om värdet är giltigt, annars använd ett standardvärde
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error(
        "Invalid timer settings for Analog Timer. Falling back to default."
      );
      remainingSeconds = 60; // Använd 60 sekunder som standard om något går fel
    }

    // Beräkningar för visarnas position på den analoga urtavlan
    const totalSecondsInMinute = 60; // Totala sekunder på en minut
    const totalMinutesOnClock = 60; // Totala minuter på en klocka (analog urtavla)

    // Räkna ut hur många minuter och sekunder som återstår
    const remainingMinutes = Math.floor(
      remainingSeconds / totalSecondsInMinute
    );
    const remainingSecondsOnly = remainingSeconds % totalSecondsInMinute;

    // Startpositioner för visarna baserat på återstående tid
    let secondHandRotation = -((60 - remainingSecondsOnly) * 6); // -6 grader för varje sekund från kl 12
    let minuteHandRotation = -((totalMinutesOnClock - remainingMinutes) * 6); // -6 grader för varje minut från kl 12

    let timerTimeout;

    // Hitta minut- och sekundvisarna i DOM
    const minuteHand = document.querySelector(".minute-hand");
    const secondHand = document.querySelector(".second-hand");

    if (!minuteHand || !secondHand) {
      console.error(
        "One or more required elements for the analog timer are missing."
      );
      return;
    }

    // Sätt visarna till rätt startposition med Anime.js
    try {
      anime({ targets: minuteHand, rotate: minuteHandRotation, duration: 0 });
      anime({ targets: secondHand, rotate: secondHandRotation, duration: 0 });
    } catch (error) {
      console.error("Error setting initial rotation positions:", error);
    }

    // Funktion för att rotera visarna och minska återstående tid
    const rotateHands = () => {
      remainingSeconds--; // Minska tiden med en sekund
      localStorage.setItem("remainingSeconds", remainingSeconds); // Uppdatera tiden i localStorage

      // Uppdatera sekundvisaren - tickar varje sekund
      secondHandRotation -= 6; // Minskar med 6 grader per sekund
      try {
        anime({
          targets: secondHand,
          rotate: secondHandRotation,
          easing: "linear",
          duration: 1000, // Varje sekund ska ta 1000 ms
        });
      } catch (error) {
        console.error("Error rotating second hand:", error);
      }

      // Uppdatera minutvisaren endast när en hel minut har passerat
      if (
        remainingSeconds % totalSecondsInMinute === 0 &&
        remainingSeconds > 0
      ) {
        minuteHandRotation -= 6; // Minskar med 6 grader per minut
        try {
          anime({
            targets: minuteHand,
            rotate: minuteHandRotation,
            easing: "linear",
            duration: 1000,
          });
        } catch (error) {
          console.error("Error rotating minute hand:", error);
        }
      }

      // Fortsätt rotationen om tid finns kvar
      if (remainingSeconds > 0) {
        timerTimeout = setTimeout(rotateHands, 1000); // Anropa igen efter 1 sekund
      } else {
        // När tiden är ute, navigera till alarm.html
        window.location.href = "alarm.html";
      }
    };

    // Starta rotationen
    rotateHands();

    // Hantera "Cancel Timer"-knappen
    cancelTimerBtn.addEventListener("click", function () {
      clearTimeout(timerTimeout); // Stoppa timerfunktionen
      window.location.href = "set-timer.html"; // Gå tillbaka till "Set Timer"-vyn
    });
  };

  // Kontrollera om vi är på Analog Timer-sidan och initiera timern
  if (document.body.contains(document.querySelector(".clock-face"))) {
    analogTimerSetup();
  }

  // Hantering av Digital Timer
  const digitalTimerSetup = () => {
    const digitalDisplay = document.getElementById("digital-display");
    const cancelDigitalTimerBtn = document.getElementById(
      "cancel-digital-timer-btn"
    );
    if (!digitalDisplay || !cancelDigitalTimerBtn) return; // Avbryt om element saknas

    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error("Invalid timer settings for Digital Timer.");
      return;
    }

    let secondsElapsed = 0;
    let timerInterval;

    // Funktion för att uppdatera digital display varje sekund
    const updateDigitalDisplay = () => {
      const totalRemainingSeconds = remainingSeconds - secondsElapsed;
      const minutes = Math.floor(totalRemainingSeconds / 60);
      const seconds = totalRemainingSeconds % 60;

      // Visa återstående tid på digital display
      digitalDisplay.textContent = `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
      localStorage.setItem("remainingSeconds", totalRemainingSeconds); // Uppdatera tiden i localStorage

      if (totalRemainingSeconds > 0) {
        secondsElapsed++; // Öka antalet sekunder som gått
      } else {
        clearInterval(timerInterval); // Stoppa uppdateringen när tiden är slut
        window.location.href = "alarm.html"; // Visa alarmvyn när tiden är ute
      }
    };

    // Starta en intervall för att uppdatera tiden varje sekund
    timerInterval = setInterval(updateDigitalDisplay, 1000);

    // Hantera "Cancel Timer"-knappen
    cancelDigitalTimerBtn.addEventListener("click", function () {
      clearInterval(timerInterval); // Stoppa intervallfunktionen
      window.location.href = "set-timer.html"; // Gå tillbaka till "Set Timer"-vyn
    });
  };

  // Kontrollera om vi är på Digital Timer-sidan och initiera timern
  if (document.body.contains(document.querySelector("#digital-display"))) {
    digitalTimerSetup();
  }

  // Hantering av Alarmvy
  const backToSetTimerBtn = document.getElementById("back-to-set-timer-btn");
  if (backToSetTimerBtn) {
    // Om knappen för att återgå till Set Timer finns, lägg till en klickhändelse
    backToSetTimerBtn.addEventListener("click", function () {
      window.location.href = "set-timer.html"; // Navigera tillbaka till "Set Timer"-vyn
    });
  }
});
