-- יצירת טבלה עם נתונים לדוגמא
CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(100),
    Family_Name VARCHAR(100),
    Gender VARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);

--הכנסת נתונים לדוגמא
INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(9, 'Dan', 'Dror', 'Male', NULL, NULL, 10),
(10, 'Dina', 'Levi', 'Female', NULL, NULL, NULL),
(8, 'Yair', 'Dror', 'Male', NULL, NULL, 7),
(7, 'Yael', 'Levi', 'Female', NULL, NULL, NULL),
(1, 'Yossi', 'Cohen', 'Male', NULL, NULL, 2),
(2, 'Miriam', 'Cohen', 'Female', NULL, NULL, 1),
(3, 'David', 'Cohen', 'Male', 1, 2, NULL),
(4, 'Dana', 'Cohen', 'Female', 1, 2, NULL),
(5, 'Tamar', 'Levi', 'Female', NULL, NULL, 3),
(6, 'Noam', 'Cohen', 'Male', 3, 5, NULL);


--תרגיל 1

--יצירת טבלת הקשרים המשפחתיים
CREATE TABLE Family_Relations (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type NVARCHAR(20)
);



INSERT INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)

-- קשרים של אב
SELECT 
    P.Person_Id,
    P.Father_Id AS Relative_Id,
    N'אב' AS Connection_Type
FROM Persons P
WHERE P.Father_Id IS NOT NULL

UNION

-- קשרים של אם
SELECT 
    P.Person_Id,
    P.Mother_Id AS Relative_Id,
    N'אם' AS Connection_Type
FROM Persons P
WHERE P.Mother_Id IS NOT NULL

UNION

-- קשרים של בן/בת זוג
SELECT 
    P.Person_Id,
    P.Spouse_Id AS Relative_Id,
    CASE P.Gender
        WHEN N'Male' THEN N'בת זוג'
        WHEN N'Female' THEN N'בן זוג'
    END AS Connection_Type
FROM Persons P
WHERE P.Spouse_Id IS NOT NULL

UNION

-- קשרים של אחים ואחיות
SELECT 
    A.Person_Id,
    B.Person_Id AS Relative_Id,
    CASE B.Gender
        WHEN N'Male' THEN N'אח'
        WHEN N'Female' THEN N'אחות'
    END AS Connection_Type
FROM Persons A
JOIN Persons B
  ON A.Father_Id = B.Father_Id
 AND A.Mother_Id = B.Mother_Id
 AND A.Person_Id <> B.Person_Id

UNION

-- קשרים של בן/בת 
SELECT 
    P.Person_Id,             -- ההורה
    C.Person_Id AS Relative_Id, -- הילד
    CASE C.Gender
        WHEN N'Male' THEN N'בן'
        WHEN N'Female' THEN N'בת'
    END AS Connection_Type
FROM Persons P
JOIN Persons C
  ON C.Father_Id = P.Person_Id
   OR C.Mother_Id = P.Person_Id;


--תרגיל 2

-- הכנס קשרי בני/בנות זוג הפוכים שחסרים
INSERT INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
SELECT 
    fr.Relative_Id AS Person_Id,
    fr.Person_Id AS Relative_Id,
    CASE fr.Connection_Type
        WHEN N'בן זוג' THEN N'בת זוג'
        WHEN N'בת זוג' THEN N'בן זוג'
    END AS Connection_Type
FROM Family_Relations fr
LEFT JOIN Family_Relations fr2
    ON fr.Relative_Id = fr2.Person_Id
   AND fr.Person_Id = fr2.Relative_Id
   AND (
       (fr.Connection_Type = N'בן זוג' AND fr2.Connection_Type = N'בת זוג') OR
       (fr.Connection_Type = N'בת זוג' AND fr2.Connection_Type = N'בן זוג')
   )
WHERE fr.Connection_Type IN (N'בן זוג', N'בת זוג')
  AND fr2.Person_Id IS NULL;


