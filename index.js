document.addEventListener("DOMContentLoaded", function () {
  // Funktion för att animera loggan och sloganen när sidan laddas
  const animateLogoAndSlogan = () => {
    return new Promise((resolve) => {
      const logoElement = document.querySelector(".logo");

      // Kontrollera om logotypen finns innan animationen startar
      if (logoElement) {
        anime({
          targets: ".logo",
          scale: [0, 1], // Zooma in från liten till full storlek
          opacity: [0, 1], // Från osynlig till synlig
          easing: "easeInOutQuad",
          duration: 1200,
          complete: function () {
            // När loggan är klar, animera sloganen snabbt
            anime({
              targets: ".slogan",
              scale: [0, 1.3, 1], // Zooma in snabbt och bli lite för stor, sedan tillbaka till normal storlek
              opacity: [0, 1],
              easing: "easeOutElastic(1, .8)",
              duration: 600,
              delay: 300, // Vänta 300 ms efter loggan är klar
              complete: function () {
                resolve(); // Signalerar att animationen är klar
              },
            });
          },
        });
      } else {
        resolve(); // Om loggan inte finns, fortsätt utan animation
      }
    });
  };

  // Kör animationen för loggan och sloganen, sedan startar vi resten av logiken
  animateLogoAndSlogan().then(() => {
    const logoElement = document.querySelector(".logo");

    // Lägg till klickhändelse på logotypen för att navigera till Set Timer-vyn
    if (logoElement) {
      logoElement.addEventListener("click", function () {
        window.location.href = "set-timer.html";
      });
    }

    // Hantering av Start Timer-knappen i Set Timer-vyn
    const startTimerBtn = document.getElementById("start-timer-btn");
    if (startTimerBtn) {
      startTimerBtn.addEventListener("click", function () {
        const minutes = parseInt(document.getElementById("minutes").value);
        // Kontrollera om inmatningen är ett giltigt antal minuter
        if (isNaN(minutes) || minutes <= 0) {
          alert("Please enter a valid number of minutes."); // Felmeddelande vid ogiltig inmatning
          return;
        }
        const totalSeconds = minutes * 60;

        // Spara total tid i sekunder i localStorage för användning i andra vyer
        localStorage.setItem("remainingSeconds", totalSeconds);

        // Navigera till Analog Timer-vyn som standard
        window.location.href = "analog-timer.html";
      });
    }

    // Navigering mellan Analog och Digital Timer
    const toAnalogLink = document.getElementById("to-analog");
    const toDigitalLink = document.getElementById("to-digital");

    if (toAnalogLink) {
      // Navigera till Analog Timer när länken klickas
      toAnalogLink.addEventListener("click", function () {
        window.location.href = "analog-timer.html";
      });
    }

    if (toDigitalLink) {
      // Navigera till Digital Timer när länken klickas
      toDigitalLink.addEventListener("click", function () {
        window.location.href = "digital-timer.html";
      });
    }

    // Kontrollera om vi är på Analog Timer-sidan och initiera timern
    if (document.body.contains(document.querySelector(".clock-face"))) {
      analogTimerSetup();
    }

    // Kontrollera om vi är på Digital Timer-sidan och initiera timern
    if (document.body.contains(document.querySelector("#digital-display"))) {
      digitalTimerSetup();
    }

    // Hantering av Alarmvyn
    const backToSetTimerBtn = document.getElementById("back-to-set-timer-btn");
    const alarmHeader = document.querySelector(".alarm-header");
    const alarmContent = document.querySelector(".alarm-content");

    // Kontrollera om vi är på alarmvyn genom att se om alarmHeader finns
    if (alarmHeader) {
      // Funktion för att animera alarmtexten
      const animateAlarmText = () => {
        return new Promise((resolve) => {
          anime({
            targets: alarmHeader,
            scale: [0, 1], // Zooma in snabbt
            opacity: [0, 1], // Från osynlig till synlig
            easing: "easeInOutQuad",
            duration: 400,
            complete: function () {
              // Skakeffekt för alarmtexten
              anime({
                targets: alarmHeader,
                translateX: [
                  { value: -10, duration: 50 },
                  { value: 10, duration: 50 },
                  { value: -10, duration: 50 },
                  { value: 10, duration: 50 },
                  { value: 0, duration: 50 },
                ],
                easing: "easeInOutQuad",
                duration: 300,
                complete: function () {
                  resolve(); // Signalerar att animationen är klar
                },
              });
            },
          });
        });
      };

      // Kör animationen och visa sedan resten av innehållet
      animateAlarmText().then(() => {
        if (alarmContent) {
          alarmContent.style.opacity = 1; // Gör innehållet synligt efter animationen
        }
      });
    }

    // Lägg till händelsehanterare för knappen för att gå tillbaka till Set Timer
    if (backToSetTimerBtn) {
      backToSetTimerBtn.addEventListener("click", function () {
        window.location.href = "set-timer.html";
      });
    }

    // Animera alla knappar när användaren hovrar över dem
    const buttons = document.querySelectorAll(".button");
    buttons.forEach((button) => {
      // När musen hovrar över knappen, skala upp den
      button.addEventListener("mouseenter", function () {
        anime({
          targets: button,
          scale: 1.1, // Skala upp till 110%
          easing: "easeInOutQuad",
          duration: 300, // 300 ms för att animera in
        });
      });

      // När musen lämnar knappen, skala ner den igen
      button.addEventListener("mouseleave", function () {
        anime({
          targets: button,
          scale: 1, // Tillbaka till normal storlek
          easing: "easeInOutQuad",
          duration: 300, // 300 ms för att animera ut
        });
      });
    });
  });

  // Funktion för att initiera och hantera den analoga timern
  const analogTimerSetup = () => {
    const cancelTimerBtn = document.getElementById("cancel-timer-btn");
    if (!cancelTimerBtn) {
      console.error("Cancel-knappen hittades inte i DOM.");
      return;
    }

    // Läs in kvarvarande sekunder från localStorage
    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error(
        "Invalid timer settings for Analog Timer. Falling back to default."
      );
      remainingSeconds = 60; // Standardvärde om något går fel
    }

    const totalSecondsInMinute = 60;
    const totalMinutesOnClock = 60;
    const remainingMinutes = Math.floor(
      remainingSeconds / totalSecondsInMinute
    );
    const remainingSecondsOnly = remainingSeconds % totalSecondsInMinute;

    // Räkna ut startpositionerna för visarna
    let secondHandRotation = -((60 - remainingSecondsOnly) * 6);
    let minuteHandRotation = -((totalMinutesOnClock - remainingMinutes) * 6);
    let timerTimeout;

    const minuteHand = document.querySelector(".minute-hand");
    const secondHand = document.querySelector(".second-hand");

    if (!minuteHand || !secondHand) {
      console.error("En eller båda visarna hittades inte i DOM.");
      return;
    }

    // Sätt visarnas startposition
    try {
      anime({ targets: minuteHand, rotate: minuteHandRotation, duration: 0 });
      anime({ targets: secondHand, rotate: secondHandRotation, duration: 0 });
    } catch (error) {
      console.error("Error setting initial rotation positions:", error);
    }

    // Funktion för att rotera visarna och uppdatera tiden
    const rotateHands = () => {
      if (remainingSeconds <= 0) {
        console.error("Remaining seconds is 0 or less.");
        return;
      }

      remainingSeconds--;
      localStorage.setItem("remainingSeconds", remainingSeconds);

      // Rotera sekundvisaren varje sekund
      secondHandRotation -= 6;
      try {
        anime({
          targets: secondHand,
          rotate: secondHandRotation,
          easing: "linear",
          duration: 1000,
        });
      } catch (error) {
        console.error("Error rotating second hand:", error);
      }

      // Uppdatera minutvisaren varje minut
      if (
        remainingSeconds % totalSecondsInMinute === 0 &&
        remainingSeconds > 0
      ) {
        minuteHandRotation -= 6;
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
        timerTimeout = setTimeout(rotateHands, 1000);
      } else {
        window.location.href = "alarm.html";
      }
    };

    rotateHands();

    // Hantera "Cancel Timer"-knappen för att avbryta och gå tillbaka till Set Timer
    cancelTimerBtn.addEventListener("click", function () {
      clearTimeout(timerTimeout);
      window.location.href = "set-timer.html";
    });
  };

  // Funktion för att initiera och hantera den digitala timern
  const digitalTimerSetup = () => {
    const digitalDisplay = document.getElementById("digital-display");
    const cancelDigitalTimerBtn = document.getElementById(
      "cancel-digital-timer-btn"
    );
    if (!digitalDisplay || !cancelDigitalTimerBtn) return;

    // Läs in kvarvarande sekunder från localStorage
    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error("Invalid timer settings for Digital Timer.");
      return;
    }

    let secondsElapsed = 0;
    let timerInterval;

    // Funktion för att uppdatera den digitala displayen varje sekund
    const updateDigitalDisplay = () => {
      const totalRemainingSeconds = remainingSeconds - secondsElapsed;
      const minutes = Math.floor(totalRemainingSeconds / 60);
      const seconds = totalRemainingSeconds % 60;

      // Uppdatera displayen med kvarvarande tid
      digitalDisplay.textContent = `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
      localStorage.setItem("remainingSeconds", totalRemainingSeconds);

      // Fortsätt att uppdatera tiden om det finns kvar
      if (totalRemainingSeconds > 0) {
        secondsElapsed++;
      } else {
        clearInterval(timerInterval);
        window.location.href = "alarm.html";
      }
    };

    // Starta en intervall som uppdaterar varje sekund
    timerInterval = setInterval(updateDigitalDisplay, 1000);

    // Hantera "Cancel Timer"-knappen för att avbryta och gå tillbaka till Set Timer
    cancelDigitalTimerBtn.addEventListener("click", function () {
      clearInterval(timerInterval);
      window.location.href = "set-timer.html";
    });
  };
});
