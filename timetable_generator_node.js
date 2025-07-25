// timetable_generator_node.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 4000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// To parse JSON bodies
app.use(bodyParser.json());

// Serve index.html on root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/generate', (req, res) => {
  try {
    const {
      CLASSES,
      DAYS,
      PERIODS,
      subjects: subjectInputs,
      freePeriods = [],
      teacherDayOffInput = []
    } = req.body;

    const SUBJECTS = subjectInputs.length;
    const subjectNames = subjectInputs.map(s => s.name);
    const subjectLimits = subjectInputs.map(s => parseInt(s.limit));
    const subjectTeachers = subjectInputs.map(s => [s.teacher1, s.teacher2]);

    const teacherList = [];
    const teacherIndexMap = {};
    const getTeacherIndex = (name) => {
      if (teacherIndexMap[name] !== undefined) return teacherIndexMap[name];
      const id = teacherList.length;
      teacherList.push(name);
      teacherIndexMap[name] = id;
      return id;
    };

    const subjectTeacherIDs = subjectTeachers.map(pair => pair.map(getTeacherIndex));

    const subjectFrequency = Array.from({ length: CLASSES }, () => Array(SUBJECTS).fill(0));
    const teacherAssignments = Array.from({ length: teacherList.length }, () => Array(DAYS).fill(0));
    const teacherBusy = Array.from({ length: teacherList.length }, () =>
      Array.from({ length: DAYS }, () => Array(PERIODS).fill(false))
    );

    const teacherDayOff = Array.from({ length: teacherList.length }, () => Array(DAYS).fill(false));
    teacherDayOffInput.forEach(({ name, day }) => {
      const tid = getTeacherIndex(name);
      teacherDayOff[tid][day - 1] = true;
    });

    const isFreePeriod = Array.from({ length: CLASSES }, () =>
      Array.from({ length: DAYS }, () => Array(PERIODS).fill(false))
    );
    freePeriods.forEach(({ classNum, dayNum, periodNums }) => {
      periodNums.forEach(p => {
        isFreePeriod[classNum - 1][dayNum - 1][p - 1] = true;
      });
    });

    let output = "";

    for (let c = 0; c < CLASSES; c++) {
      output += `Class ${c + 1} Timetable:\n`;
      output += `----------------------------------------------------------------------------------------------\n`;

      for (let d = 0; d < DAYS; d++) {
        output += `Day ${d + 1}: `;
        const assignedToday = Array(SUBJECTS).fill(false);

        for (let p = 0; p < PERIODS; p++) {
          if (p === 2) {
            output += `[Break] `;
            continue;
          }

          if (isFreePeriod[c][d][p]) {
            output += `[Free] `;
            continue;
          }

          let assigned = false;
          const subjectOrder = [...Array(SUBJECTS).keys()].sort(() => Math.random() - 0.5);

          for (const sub of subjectOrder) {
            if (assignedToday[sub]) continue;
            if (subjectFrequency[c][sub] >= subjectLimits[sub]) continue;

            const [t1, t2] = subjectTeacherIDs[sub];

            const canAssign = (tid) => {
              return (
                !teacherDayOff[tid][d] &&
                teacherAssignments[tid][d] < 4 &&
                !teacherBusy[tid][d][p]
              );
            };

            if (canAssign(t1)) {
              assignSubject(t1, sub);
              break;
            } else if (canAssign(t2)) {
              assignSubject(t2, sub);
              break;
            }
          }

          if (!assigned) {
            output += `[Free] `;
          }

          function assignSubject(tid, sub) {
            teacherAssignments[tid][d]++;
            teacherBusy[tid][d][p] = true;
            subjectFrequency[c][sub]++;
            assignedToday[sub] = true;
            output += `[${subjectNames[sub]}-${teacherList[tid]}] `;
            assigned = true;
          }
        }
        output += `\n`;
      }

      output += `----------------------------------------------------------------------------------------------\n\n`;
    }

    res.send(output);
  } catch (error) {
    console.error("❌ Error generating timetable:", error);
    res.status(500).send("Error generating timetable: " + error.message);
  }
});


app.listen(PORT, () => {
  console.log(`✅ Timetable generator running at: http://localhost:${PORT}`);
});
