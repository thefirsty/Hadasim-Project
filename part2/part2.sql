-- Creating a table with sample data
CREATE TABLE Persons (
    Person_Id INT PRIMARY KEY,
    First_Name VARCHAR(100),
    Last_Name VARCHAR(100),
    Gender VARCHAR(10),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT
);

-- Inserting sample data
INSERT INTO Persons (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
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


-- Exercise 1

-- Creating a table for family relationships
CREATE TABLE Family_Relations (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type NVARCHAR(20)
);

INSERT INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)

-- Father relationships
SELECT 
    P.Person_Id,
    P.Father_Id AS Relative_Id,
    N'Father' AS Connection_Type
FROM Persons P
WHERE P.Father_Id IS NOT NULL

UNION

-- Mother relationships
SELECT 
    P.Person_Id,
    P.Mother_Id AS Relative_Id,
    N'Mother' AS Connection_Type
FROM Persons P
WHERE P.Mother_Id IS NOT NULL

UNION

-- Spouse relationships
SELECT 
    P.Person_Id,
    P.Spouse_Id AS Relative_Id,
    CASE P.Gender
        WHEN N'Male' THEN N'Wife'
        WHEN N'Female' THEN N'Husband'
    END AS Connection_Type
FROM Persons P
WHERE P.Spouse_Id IS NOT NULL

UNION

-- Sibling relationships
SELECT 
    A.Person_Id,
    B.Person_Id AS Relative_Id,
    CASE B.Gender
        WHEN N'Male' THEN N'Brother'
        WHEN N'Female' THEN N'Sister'
    END AS Connection_Type
FROM Persons A
JOIN Persons B
  ON A.Father_Id = B.Father_Id
 AND A.Mother_Id = B.Mother_Id
 AND A.Person_Id <> B.Person_Id

UNION

-- Child relationships
SELECT 
    P.Person_Id,             -- Parent
    C.Person_Id AS Relative_Id, -- Child
    CASE C.Gender
        WHEN N'Male' THEN N'Son'
        WHEN N'Female' THEN N'Daughter'
    END AS Connection_Type
FROM Persons P
JOIN Persons C
  ON C.Father_Id = P.Person_Id
   OR C.Mother_Id = P.Person_Id;


-- Exercise 2

-- Insert missing reciprocal spouse relationships
INSERT INTO Family_Relations (Person_Id, Relative_Id, Connection_Type)
SELECT 
    fr.Relative_Id AS Person_Id,
    fr.Person_Id AS Relative_Id,
    CASE fr.Connection_Type
        WHEN N'Husband' THEN N'Wife'
        WHEN N'Wife' THEN N'Husband'
    END AS Connection_Type
FROM Family_Relations fr
LEFT JOIN Family_Relations fr2
    ON fr.Relative_Id = fr2.Person_Id
   AND fr.Person_Id = fr2.Relative_Id
   AND (
       (fr.Connection_Type = N'Husband' AND fr2.Connection_Type = N'Wife') OR
       (fr.Connection_Type = N'Wife' AND fr2.Connection_Type = N'Husband')
   )
WHERE fr.Connection_Type IN (N'Husband', N'Wife')
  AND fr2.Person_Id IS NULL;


select * from Family_Relations