document.addEventListener("DOMContentLoaded", function () {
  // Navigera från loading-skärmen till set-timer.html
  const logoElement = document.querySelector(".logo");
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
      if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
      }
      const totalSeconds = minutes * 60;

      // Spara timerinställningar i localStorage för att använda i analog och digital timer
      localStorage.setItem("remainingSeconds", totalSeconds);

      // Navigera till Analog Timer-vyn som standard
      window.location.href = "analog-timer.html";
    });
  }

  // Navigera mellan Analog och Digital Timer
  const toAnalogLink = document.getElementById("to-analog");
  const toDigitalLink = document.getElementById("to-digital");

  if (toAnalogLink) {
    toAnalogLink.addEventListener("click", function () {
      window.location.href = "analog-timer.html";
    });
  }

  if (toDigitalLink) {
    toDigitalLink.addEventListener("click", function () {
      window.location.href = "digital-timer.html";
    });
  }

  // Hantering av den analoga timern
  const analogTimerSetup = () => {
    const cancelTimerBtn = document.getElementById("cancel-timer-btn");
    if (!cancelTimerBtn) return;

    // Läs av remainingSeconds från localStorage
    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));

    // Kontrollera om värdet är giltigt
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error(
        "Invalid timer settings for Analog Timer. Falling back to default."
      );
      remainingSeconds = 60;
    }

    // Beräkna startpositionen för minut- och sekundvisaren
    const totalSecondsInMinute = 60;
    const totalMinutesOnClock = 60;

    // Exakt beräkning för minut- och sekundvisaren
    const remainingMinutes = Math.floor(
      remainingSeconds / totalSecondsInMinute
    );
    const remainingSecondsOnly = remainingSeconds % totalSecondsInMinute;

    // Startpositioner för visarna
    let secondHandRotation = -((60 - remainingSecondsOnly) * 6); // -6 grader för varje sekund från "kl 12"
    let minuteHandRotation = -((totalMinutesOnClock - remainingMinutes) * 6); // -6 grader för varje minut från "kl 12"

    let timerTimeout;

    const minuteHand = document.querySelector(".minute-hand");
    const secondHand = document.querySelector(".second-hand");

    if (!minuteHand || !secondHand) {
      console.error(
        "One or more required elements for the analog timer are missing."
      );
      return;
    }

    // Sätt visarna till rätt startposition
    try {
      anime({
        targets: minuteHand,
        rotate: minuteHandRotation,
        duration: 0,
      });
      anime({
        targets: secondHand,
        rotate: secondHandRotation,
        duration: 0,
      });
    } catch (error) {
      console.error("Error setting initial rotation positions:", error);
    }

    const rotateHands = () => {
      // Minska återstående tid
      remainingSeconds--;
      localStorage.setItem("remainingSeconds", remainingSeconds);

      // Uppdatera sekundvisaren - tickar varje sekund
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

      // Uppdatera minutvisaren endast när 60 sekunder har passerat
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
        // När tiden är ute, navigera till alarm.html
        window.location.href = "alarm.html";
      }
    };

    // Starta rotationen
    rotateHands();

    // Hantera "Cancel Timer"-knappen
    cancelTimerBtn.addEventListener("click", function () {
      clearTimeout(timerTimeout);
      window.location.href = "set-timer.html";
    });
  };

  if (document.body.contains(document.querySelector(".clock-face"))) {
    analogTimerSetup();
  }

  // Hantering av Digital Timer
  const digitalTimerSetup = () => {
    const digitalDisplay = document.getElementById("digital-display");
    const cancelDigitalTimerBtn = document.getElementById(
      "cancel-digital-timer-btn"
    );
    if (!digitalDisplay || !cancelDigitalTimerBtn) return;

    let remainingSeconds = parseInt(localStorage.getItem("remainingSeconds"));
    if (isNaN(remainingSeconds) || remainingSeconds <= 0) {
      console.error("Invalid timer settings for Digital Timer.");
      return;
    }

    let secondsElapsed = 0;
    let timerInterval;

    const updateDigitalDisplay = () => {
      const totalRemainingSeconds = remainingSeconds - secondsElapsed;
      const minutes = Math.floor(totalRemainingSeconds / 60);
      const seconds = totalRemainingSeconds % 60;

      digitalDisplay.textContent = `${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
      localStorage.setItem("remainingSeconds", totalRemainingSeconds);

      if (totalRemainingSeconds > 0) {
        secondsElapsed++;
      } else {
        clearInterval(timerInterval);
        // När tiden är ute, navigera till alarm.html
        window.location.href = "alarm.html";
      }
    };

    timerInterval = setInterval(updateDigitalDisplay, 1000);

    cancelDigitalTimerBtn.addEventListener("click", function () {
      clearInterval(timerInterval);
      window.location.href = "set-timer.html";
    });
  };

  if (document.body.contains(document.querySelector("#digital-display"))) {
    digitalTimerSetup();
  }

  // Hantering av Alarmvy
  const backToSetTimerBtn = document.getElementById("back-to-set-timer-btn");
  if (backToSetTimerBtn) {
    backToSetTimerBtn.addEventListener("click", function () {
      window.location.href = "set-timer.html";
    });
  }
});
