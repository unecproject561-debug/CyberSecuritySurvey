const SUPABASE_URL =
  "https://tzrmnihtnhfvblxfmpmq.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_qZbWQe4oq5OGUem8xVwMrA_-xvX2-vl";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================
   SUALLAR
========================= */

const securityQuestions = [
  "İş və ya universitet hesablarım üçün eyni parolu başqa platformalarda istifadə etmirəm.",
  "Vacib hesablarımda iki mərhələli doğrulamanı (2FA/MFA) aktiv etmişəm.",
  "Proqram və əməliyyat sistemi yeniləmələrini təhlükəsizlik səbəbilə gecikdirmirəm.",
  "Email və mesajlarda gələn linkləri açmazdan əvvəl domeni və göndərəni yoxlayıram.",
  "Vacib məlumatların itirilməsinə qarşı müstəqil ehtiyat nüsxələr saxlayıram."
];

const digitalQuestions = [
  "Sosial şəbəkədə paylaşım etməzdən əvvəl həmin məlumatın gələcəkdə mənə və ya başqasına təsirini nəzərə alıram.",
  "Tanımadığım şəxslərdən gələn dostluq, izləmə və mesaj sorğularının profilini yoxlayıram.",
  "Pulsuz proqram və faylları yükləyərkən mənbənin etibarlılığını və istifadəçi rəylərini yoxlayıram.",
  "Şəxsi məlumatlarımı onlayn xidmətə təqdim etməzdən əvvəl həmin məlumatın niyə tələb olunduğunu düşünürəm.",
  "Sosial şəbəkələrdə məxfilik parametrlərimi və tətbiqlərin hesabıma giriş icazələrini vaxtaşırı yoxlayıram."
];


/* =========================
   LIKERT SUALLARI YARAT
========================= */

function createScaleQuestion(text, number, prefix) {

  const div = document.createElement("div");

  div.className = "scale-question";

  div.innerHTML = `
    <div class="question-number">
      SUAL ${String(number).padStart(2, "0")}
    </div>

    <p>${text}</p>

    <label>
      <input type="radio" name="${prefix}${number}" value="1">
      1 — Heç vaxt
    </label>

    <label>
      <input type="radio" name="${prefix}${number}" value="2">
      2 — Nadir hallarda
    </label>

    <label>
      <input type="radio" name="${prefix}${number}" value="3">
      3 — Bəzən
    </label>

    <label>
      <input type="radio" name="${prefix}${number}" value="4">
      4 — Çox vaxt
    </label>

    <label>
      <input type="radio" name="${prefix}${number}" value="5">
      5 — Həmişə
    </label>
  `;

  return div;
}


/* =========================
   SUALLARI HTML-Ə ƏLAVƏ ET
========================= */

const securityContainer =
  document.getElementById("securityQuestions");

securityQuestions.forEach((question, index) => {

  securityContainer.appendChild(
    createScaleQuestion(
      question,
      index + 1,
      "security"
    )
  );

});


const digitalContainer =
  document.getElementById("digitalQuestions");

digitalQuestions.forEach((question, index) => {

  digitalContainer.appendChild(
    createScaleQuestion(
      question,
      index + 1,
      "digital"
    )
  );

});


/* =========================
   CAVAB AL
========================= */

function getAnswer(name) {

  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );

  return selected
    ? Number(selected.value)
    : null;
}


/* =========================
   PROGRESS BAR
========================= */

function updateProgress() {

  const allQuestions =
    document.querySelectorAll(
      'input[type="radio"]'
    );

  const questionNames =
    new Set();

  allQuestions.forEach(input => {
    questionNames.add(input.name);
  });

  let answered = 0;

  questionNames.forEach(name => {

    if (
      document.querySelector(
        `input[name="${name}"]:checked`
      )
    ) {
      answered++;
    }

  });

  const total = questionNames.size;

  const percentage =
    Math.round(
      (answered / total) * 100
    );

  document.getElementById(
    "progress"
  ).style.width =
    percentage + "%";

  document.getElementById(
    "progressText"
  ).textContent =
    percentage + "%";
}


document.addEventListener(
  "change",
  updateProgress
);


/* =========================
   SORĞUNU GÖNDƏR
========================= */

document
  .getElementById("submitBtn")
  .addEventListener(
    "click",
    async () => {

      const name =
        document
          .getElementById(
            "participantName"
          )
          .value
          .trim();


      const message =
        document.getElementById(
          "message"
        );


      const button =
        document.getElementById(
          "submitBtn"
        );


      /* AD YOXLAMASI */

      if (!name) {

        message.textContent =
          "⚠️ Zəhmət olmasa ad və soyadınızı daxil edin.";

        document
          .getElementById(
            "participantName"
          )
          .focus();

        return;
      }


      /* =========================
         MƏLUMATLILIQ
      ========================= */

      const awarenessAnswers = [];

      for (let i = 1; i <= 5; i++) {

        const answer =
          getAnswer(`q${i}`);

        if (answer === null) {

          message.textContent =
            `⚠️ Məlumatlılıq bölməsində Sual ${i} cavablandırılmayıb.`;

          return;
        }

        awarenessAnswers.push(answer);
      }


      /* =========================
         TƏHLÜKƏSİZLİK DAVRANIŞI
      ========================= */

      const securityAnswers = [];

      for (let i = 1; i <= 5; i++) {

        const answer =
          getAnswer(
            `security${i}`
          );

        if (answer === null) {

          message.textContent =
            `⚠️ Təhlükəsizlik davranışı bölməsində Sual ${i} cavablandırılmayıb.`;

          return;
        }

        securityAnswers.push(answer);
      }


      /* =========================
         RƏQƏMSAL DAVRANIŞ
      ========================= */

      const digitalAnswers = [];

      for (let i = 1; i <= 5; i++) {

        const answer =
          getAnswer(
            `digital${i}`
          );

        if (answer === null) {

          message.textContent =
            `⚠️ Rəqəmsal davranış bölməsində Sual ${i} cavablandırılmayıb.`;

          return;
        }

        digitalAnswers.push(answer);
      }


      /* =========================
         BALLAR
      ========================= */

      const awarenessScore =
        awarenessAnswers.reduce(
          (sum, value) =>
            sum + value,
          0
        );


      const securityScore =
        securityAnswers.reduce(
          (sum, value) =>
            sum + value,
          0
        );


      const digitalScore =
        digitalAnswers.reduce(
          (sum, value) =>
            sum + value,
          0
        );


      const totalScore =
        awarenessScore +
        securityScore +
        digitalScore;


      /* =========================
         CAVABLAR
      ========================= */

      const answers = {

        awareness:
          awarenessAnswers,

        security:
          securityAnswers,

        digital:
          digitalAnswers

      };


      /* =========================
         GÖNDƏRİLİR
      ========================= */

      button.disabled = true;

      button.innerHTML =
        "<span>Göndərilir...</span>";


      /* =========================
         SUPABASE
      ========================= */

      const { error } =
        await supabaseClient
          .from(
            "survey_responses"
          )
          .insert({

            participant_name:
              name,

            answers:
              answers,

            awareness_score:
              awarenessScore,

            security_score:
              securityScore,

            digital_score:
              digitalScore,

            total_score:
              totalScore

          });


      /* =========================
         XƏTA
      ========================= */

      if (error) {

        console.error(error);

        button.disabled = false;

        button.innerHTML =
          "<span>Sorğunu göndər</span><b>→</b>";

        message.textContent =
          "❌ Cavabları göndərmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.";

        return;
      }


      /* =========================
         UĞURLU
      ========================= */

      document.getElementById(
        "survey"
      ).innerHTML = `

        <div class="success">

          <div class="success-icon">
            ✓
          </div>

          <h2>
            Sorğunuz uğurla göndərildi!
          </h2>

          <p>
            İştirakınıza görə təşəkkür edirik.
          </p>

          <p>
            Cavablarınız uğurla qeydə alındı.
          </p>

        </div>

      `;


      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    }
  );
