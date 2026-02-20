CREATE DATABASE HOC COLLATE Thai_CI_AS;

USE HOC;

--DROP TABLE IF EXISTS [dbo].[ContractParty];
--DROP TABLE IF EXISTS [dbo].[InsuranceCompany];
DROP TABLE IF EXISTS [dbo].[StockCode];
DROP TABLE IF EXISTS [dbo].[Formula];
DROP TABLE IF EXISTS [dbo].[Eventlog];
--DROP TABLE IF EXISTS [dbo].[FileFTP];
DROP TABLE IF EXISTS [dbo].[HOC];
Drop TABLE IF EXISTS [dbo].[Staffs];
DROP TABLE IF EXISTS [dbo].[Departments];

CREATE TABLE [dbo].[Departments] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [ShortName] NVARCHAR(50) NOT NULL UNIQUE,
    [Fullname] NVARCHAR(50) NULL,
    [Name] NVARCHAR(255) DEFAULT NULL,
    [CreateAt] DATETIME DEFAULT GETDATE(),
    [UpdateAt] DATETIME DEFAULT GETDATE(),
    [DeleteAt] DATETIME DEFAULT NULL,
);

INSERT INTO [dbo].[Departments] ([ShortName],[Name],[Fullname])
VALUES
('Dev','IT','IT')

CREATE TABLE [dbo].[Staffs] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [UserId] NVARCHAR(50) NOT NULL UNIQUE,
    [Name] NVARCHAR(50) DEFAULT NULL,
    [Dept] INT NOT NULL DEFAULT 1,
    [UserType] INT NOT NULL DEFAULT 1,
    [Role] INT NOT NULL DEFAULT 1,
    [Password] NVARCHAR(255) NOT NULL,
    [CreateAt] DATETIME DEFAULT GETDATE(),
    [UpdateAt] DATETIME DEFAULT GETDATE(),
    [DeleteAt] DATETIME DEFAULT NULL,
    FOREIGN KEY (Dept) REFERENCES Departments(Id)
);

INSERT INTO [dbo].[Staffs] ([UserId],[Name],[Dept],[Password],[Role],[UserType])
VALUES
('000000','admin',1,'$2a$12$53PPHaeHhJeOS59Y1742LuZXX1BwE0fQ9oxYCI/0GGs1RqNFraBEu',3,1);

CREATE TABLE [dbo].[HOC] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Status] INT DEFAULT 1,
    [HN] NVARCHAR(50) NOT NULL,
    [VN] NVARCHAR(50) DEFAULT NULL,
    [FullName] NVARCHAR(255) DEFAULT NULL,
    -- [insuranceType] NVARCHAR(100) DEFAULT NULL,
    -- [insuranceCompany] NVARCHAR(100) DEFAULT NULL,
    -- [ContractParty] NVARCHAR(100) DEFAULT NULL,
    [Dept] INT NOT NULL DEFAULT 1,
    [FormData] NVARCHAR(MAX) NOT NULL,
    --[RightList] NVARCHAR(MAX) DEFAULT NULL,
    [CreateAt] DATETIME DEFAULT GETDATE(),
    [AcceptAt] DATETIME DEFAULT NULL,
    [VerifyAt] DATETIME DEFAULT NULL,
    [UpdateAt] DATETIME DEFAULT GETDATE(),
    [DeleteAt] DATETIME DEFAULT NULL,
    [CreatedBy] NVARCHAR(50) DEFAULT NULL,
    [UserType] INT NOT NULL DEFAULT 1,
    [Remark] NVARCHAR(MAX) DEFAULT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Staffs(UserId),
    FOREIGN KEY (Dept) REFERENCES Departments(Id)
);

-- CREATE TABLE [dbo].[FileFTP] (
--     [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
--     [OrderIdd] NVARCHAR(MAX) NOT NULL,
--     [Idd] INT NOT NULL DEFAULT 1,
--     [FileName] NVARCHAR(MAX) NOT NULL,
--     [Date] NVARCHAR(8) NOT NULL,
--     [CreateAt] DATETIME DEFAULT GETDATE(),
--     [UpdateAt] DATETIME DEFAULT GETDATE(),
--     [DeleteAt] DATETIME DEFAULT NULL,
-- );

CREATE TABLE [dbo].[Eventlog] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [RowId] INT NOT NULL,
    [action] NVARCHAR(MAX) NOT NULL,
    [remark] NVARCHAR(MAX) NOT NULL,
    [CreateAt] DATETIME DEFAULT GETDATE(),
    [CreatedBy] NVARCHAR(50) DEFAULT NULL,
    FOREIGN KEY (RowId) REFERENCES HOC(Id)
);

CREATE TABLE [dbo].[Formula] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    -- [IdenId] NVARCHAR(50) NOT NULL,
    [FormulaName] NVARCHAR(255) DEFAULT NULL,
    [FormulaList] NVARCHAR(MAX)DEFAULT NULL,
    [Remark] NVARCHAR(MAX) DEFAULT NULL,
    [CreatedBy] NVARCHAR(50) DEFAULT NULL,
    [DeleteAt] DATETIME DEFAULT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES Staffs(UserId),
);

CREATE TABLE [dbo].[StockCode] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(50) NOT NULL,
    [EnglishName] NVARCHAR(MAX) DEFAULT NULL,
    [ThaiName] NVARCHAR(MAX) DEFAULT NULL,
    [Activity] NVARCHAR(MAX) DEFAULT NULL,
    [Type] NVARCHAR(50) NOT NULL,
    [OPDPrice] INT DEFAULT 0,
    [IPDPrice] INT DEFAULT 0,
    [InterPrice] INT DEFAULT 0,
);

-- CREATE TABLE [dbo].[InsuranceCompany] (
--     [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
--     [Name] NVARCHAR(MAX) NOT NULL,
--     [type] INT NOT NULL DEFAULT 1,
-- );

-- INSERT INTO InsuranceCompany (name, type) VALUES
-- ('AIA', 1),
-- ('อลิอันซ์ อยุธยา ประกันภัย', 1),
-- ('อลิอันซ์ อยุธยา ประกันชีวิต', 1),
-- ('เมืองไทยประกันชีวิต', 1),
-- ('เมืองไทยประกันภัย', 1),
-- ('กรุงเทพประกันชีวิต', 1),
-- ('กรุงเทพประกันภัย', 1),
-- ('ไทยประกันชีวิต (กลุ่ม)', 1),
-- ('ทิพยประกันชีวิต', 1),
-- ('ทิพยประกันภัย', 1),
-- ('เจนเนอราลี่ไทยแลนด์', 1),
-- ('เจนเนอราลี่ไทยแลนด์ ปก.ภัย', 1),
-- ('FWD', 1),
-- ('อาคเนย์ประกันชีวิต', 1),
-- ('Allianz Partners (AWP)', 1),
-- ('MSIG', 1),
-- ('โตเกียวมารีน', 1),
-- ('วิริยะประกันภัย', 1),
-- ('พรูเด็นเชียลประกันชีวิต', 1),
-- ('ไทยสมุทรประกันชีวิต', 1),
-- ('ซัมซุงประกันชีวิต', 1),
-- ('KT-AXA', 1),
-- ('AXA ประกันภัย (ผ่านตัวเอง)', 1),
-- ('MSIG มิตซุย สุมิโตโม', 1),
-- ('MED-SURE', 1),
-- ('LMG', 1),
-- ('Lawton Asia(ผ่านHBC)', 1),
-- ('CHUBB', 1),
-- ('Medilink', 1),
-- ('ทิพยะประกันภัย Medilink', 1),
-- ('ไทยพาณิชย์ Medilink', 1),
-- ('เทเวศน์ประกันภัย', 1),
-- ('LUMA', 1),
-- ('AGA (Allianz Global Emergency assistance)', 1),
-- ('ไทยประกันสุขภาพ', 1),
-- ('Prestige International', 1),
-- ('ไทยวิวัฒน์ประกันภัย', 1),
-- ('ไทยวิวัฒน์ ยูโรเซ็นเตอร์', 1),
-- ('April', 1),
-- ('ฟิลลิป', 1),
-- ('สยาม สไมล์', 1),
-- ('สไมล์ ทีพีเอ', 1),
-- ('AIG', 1),
-- ('เทเวศประกันภัย', 1),
-- ('นวกิจประกันภัย', 1),
-- ('HSC', 1),
-- ('Medihealth', 1),
-- ('พรบกลางคุ้มภัย', 1),
-- ('ไทยไพบูลย์ปะกันภัย', 1),
-- ('คุ้มภัยโตเกียวมารีนประกันภัย', 1),
-- ('Sunday Care', 1),
-- ('HCMS (Sompo)', 1),
-- ('มิตรแท้', 1),
-- ('AIA', 2),
-- ('อลิอันซ์ อยุธยา ประกันภัย', 2),
-- ('อลิอันซ์ อยุธยา ประกันชีวิต', 2),
-- ('เมืองไทยประกันชีวิต', 2),
-- ('เมืองไทยประกันภัย', 2),
-- ('กรุงเทพประกันชีวิต', 2),
-- ('กรุงเทพประกันภัย', 2),
-- ('ไทยประกันชีวิต (กลุ่ม)', 2),
-- ('ทิพยประกันชีวิต', 2),
-- ('ทิพยประกันภัย', 2),
-- ('เจนเนอราลี่ไทยแลนด์', 2),
-- ('เจนเนอราลี่ไทยแลนด์ ปก.ภัย', 2),
-- ('FWD', 2),
-- ('อาคเนย์ประกันชีวิต', 2),
-- ('Allianz Partners (AWP)', 2),
-- ('MSIG', 2),
-- ('โตเกียวมารีน', 2),
-- ('วิริยะประกันภัย', 2),
-- ('พรูเด็นเชียลประกันชีวิต', 2),
-- ('ไทยสมุทรประกันชีวิต', 2),
-- ('ซัมซุงประกันชีวิต', 2),
-- ('KT-AXA', 2),
-- ('AXA ประกันภัย (ผ่านตัวเอง)', 2),
-- ('MSIG มิตซุย สุมิโตโม', 2),
-- ('MED-SURE', 2),
-- ('LMG', 2),
-- ('Lawton Asia(ผ่านHBC)', 2),
-- ('CHUBB', 2),
-- ('Medilink', 2),
-- ('ทิพยะประกันภัย Medilink', 2),
-- ('ไทยพาณิชย์ Medilink', 2),
-- ('เทเวศน์ประกันภัย', 2),
-- ('LUMA', 2),
-- ('AGA (Allianz Global Emergency assistance)', 2),
-- ('ไทยประกันสุขภาพ', 2),
-- ('Prestige International', 2),
-- ('ไทยวิวัฒน์ประกันภัย', 2),
-- ('ไทยวิวัฒน์ ยูโรเซ็นเตอร์', 2),
-- ('April', 2),
-- ('ฟิลลิป', 2),
-- ('สยาม สไมล์', 2),
-- ('สไมล์ ทีพีเอ', 2),
-- ('AIG', 2),
-- ('เทเวศประกันภัย', 2),
-- ('นวกิจประกันภัย', 2),
-- ('HSC', 2),
-- ('Medihealth', 2),
-- ('พรบกลางคุ้มภัย', 2),
-- ('ไทยไพบูลย์ปะกันภัย', 2),
-- ('คุ้มภัยโตเกียวมารีนประกันภัย', 2),
-- ('Sunday Care', 2),
-- ('HCMS (Sompo)', 2),
-- ('มิตรแท้', 2);


-- CREATE TABLE [dbo].[ContractParty] (
--     [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
--     [Name] NVARCHAR(MAX) NOT NULL,
--     [type] INT NOT NULL DEFAULT 1,
-- );

-- INSERT INTO [dbo].[ContractParty] ([Name], [type]) VALUES
-- (N'สยามโตโยต้า', 1),
-- (N'Toyota motor', 1),
-- (N'Denso', 1),
-- (N'Honda Automobile', 1),
-- (N'ไทยยามาฮ่า (INTER SOS)', 1),
-- (N'NHK', 1),
-- (N'IZUSU มอเตอร์', 1),
-- (N'หลักทรัพย์ฟิลลิป', 1),
-- (N'ซิลลิค ฟาร์ม่า', 1),
-- (N'CPF', 1),
-- (N'ไทยแอร์ไรว์', 1),
-- (N'อาชิโมริ', 1),
-- (N'ดาต้าโปร', 1),
-- (N'มิตรซูบิชิมอร์เตอร์', 1),
-- (N'SCG', 1),
-- (N'ไอซิน', 1),
-- (N'เบอรี่ยุคเกอร์', 1),
-- (N'ไทยสัมมิท', 1),
-- (N'ไทยโพลิเอ็ท', 1),
-- (N'ไบเทค', 1),
-- (N'แพนโดร่า', 1),
-- (N'แพนด้าจิวเวอร์', 1),
-- (N'เพอร์เฟคคอมพาดนียน', 1),
-- (N'พอร์ทเตอร์', 1),
-- (N'พรีเมียรมาเก็ตติ้ง', 1),
-- (N'พร้อม เทคโน', 1),
-- (N'พาราไดซ์', 1),
-- (N'เซ็นทัล', 1),
-- (N'ศูนย์บริการเหล็กสยาม', 1),
-- (N'เมกะ บางนา', 1),
-- (N'ไหมไทย', 1),
-- (N'อุสาหกรรมเครื่องแก้ว', 1),
-- (N'คาโอ อินดัสเตียร', 1),
-- (N'แคร์เรีย', 1),
-- (N'คราวฟูด', 1),
-- (N'เด็นโซ่ อิเล็กทริก (อันเด็น)', 1);

-- INSERT INTO [dbo].[ContractParty] ([Name], [type]) VALUES
-- (N'สยามโตโยต้า', 2),
-- (N'Toyota motor', 2),
-- (N'Denso', 2),
-- (N'Honda Automobile', 2),
-- (N'ไทยยามาฮ่า (INTER SOS)', 2),
-- (N'NHK', 2);

-- INSERT INTO [dbo].[RightVerify] ([HN],[VN],[FormData],[CreatedBy])
-- VALUES
-- ('333333','123123123',
-- N'{"fullname":"13132","hn":"1321321","an":"13132132","birthday":"","age":"","gender":"","doctor":"","clinic":"","patientType":"","visitType":"","insuranceType":"","singleInsurance":false,"groupInsurance":false,"hasReferral":false,"hasStaffCard":false,"staffRelation":"employee","accidentTime":"","contractingparty":false,"vitalSigns":{"bmi":"","HC":"","Ht":"","tc":"","p":"","r":"","bp":"","o2sat":"","ps":""},"checklist":{"medicalcertificate":false,"NoMedicalCertificate":false,"lab":false,"ekgegg":false,"medicalsupplies":false,"refernote":false,"insurancenote":false,"xray":false,"injection":false}}'
-- ,'000000');

-- CREATE TABLE [dbo].[RightOrder] (
--     [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
--     [RightVerifyId] INT NOT NULL,
--     [RightList] NVARCHAR(MAX) NOT NULL,
--     -- [CreateAt] DATETIME DEFAULT GETDATE(),
--     -- [UpdateAt] DATETIME DEFAULT GETDATE(),
--     -- [DeleteAt] DATETIME DEFAULT NULL,
--     [CreatedBy] NVARCHAR(50) DEFAULT NULL,
--     FOREIGN KEY (CreatedBy) REFERENCES Staffs(UserId),
--     FOREIGN KEY (RightVerifyId) REFERENCES RightVerify(Id)
-- );

USE [HOC]
GO
/****** Object:  View [dbo].[QUEUE_CLINIC_NAME]    Script Date: 30/7/2568 15:49:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[QUEUE_CLINIC_NAME] AS
SELECT code as ClinicCode ,
CONVERT(nvarchar,RIGHT( DNSYSCONFIG.LocalName , LEN( DNSYSCONFIG.LocalName ) - 1)) as ClinicNameThai,
CONVERT(nvarchar,RIGHT( DNSYSCONFIG.EnglishName , LEN( DNSYSCONFIG.EnglishName ) - 1)) as ClinicNameEng
FROM [10.1.1.117].[DNHOS].[dbo].DNSYSCONFIG 
WHERE CtrlCode ='42203' AND LocalName NOT LIKE '%OFF%'; 
GO

USE [HOC]
GO
/****** Object:  View [dbo].[DOC_MASTER]    Script Date: 06/08/2568 16:18:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[DOC_MASTER] AS

SELECT [Doctor]
,(SUBSTRING(LocalName, CHARINDEX('\', LocalName) + 1, len(LocalName))) AS [InitialName]
,(LEFT(RIGHT(LocalName , LEN( LocalName ) - 1), CASE WHEN charindex(' ', RIGHT(LocalName , LEN( LocalName ) - 1)) = 0 THEN LEN(RIGHT(LocalName , LEN( LocalName ) - 1)) ELSE charindex(' ', RIGHT(LocalName , LEN( LocalName ) - 1)) - 1 END)) AS [FirstName]
,(REPLACE(SUBSTRING(LocalName,CHARINDEX(' ',LocalName)+1,(((LEN(LocalName))-CHARINDEX('\', REVERSE(LocalName)))-CHARINDEX(' ',LocalName))),' ','')) AS [LastName]
,(CASE WHEN CHARINDEX('\', LocalName) > 0 THEN CONCAT(SUBSTRING(LocalName, CHARINDEX('\', LocalName) + 1, len(LocalName)), ' ', LEFT((RIGHT(LocalName, LEN(LocalName) - 1)),CHARINDEX('\',(RIGHT(LocalName, LEN(LocalName) - 1))) - 1)) ELSE RIGHT(LocalName, LEN(LocalName) - 1) END) AS [LocalName]
,(CASE WHEN CHARINDEX('\', EnglishName) > 0 THEN CONCAT(SUBSTRING(EnglishName, CHARINDEX('\', EnglishName) + 1, len(EnglishName)), ' ', LEFT((RIGHT(EnglishName, LEN(EnglishName) - 1)), CHARINDEX('\', (RIGHT(EnglishName, LEN(EnglishName) - 1))) - 1)) ELSE RIGHT(EnglishName, LEN(EnglishName) - 1) END) AS [EnglishName]
, [DoctorCategoryGroup]
, [Specialty],(select RIGHT( DNSYSCONFIG.LocalName , LEN( DNSYSCONFIG.LocalName ) - 1) from [10.1.1.117].[DNHOS].[dbo].DNSYSCONFIG where CtrlCode  ='42197' and Code = Specialty ) AS [SpecialtyName]
, [UserCode], [CertifyPublicNo], [ComposeDept], [Clinic], Case when Gender = '1' THEN 'F' ELSE 'M' END AS Gender, [Inactive]
FROM [10.1.1.117].[DNHOS].[dbo].[HNDOCTOR_MASTER]
WHERE len(Doctor) > '1' AND LocalName LIKE '%\%' AND LocalName NOT LIKE '%คณะ%' /*I(nactive <> '1' or Inactive is null) and */ 

UNION ALL
SELECT [Doctor]
,(SUBSTRING(LocalName, CHARINDEX('\', LocalName) + 1, len(LocalName))) AS [InitialName]
,(LEFT(RIGHT(LocalName , LEN( LocalName ) - 1), CASE WHEN charindex(' ', RIGHT(LocalName , LEN( LocalName ) - 1)) = 0 THEN LEN(RIGHT(LocalName , LEN( LocalName ) - 1)) ELSE charindex(' ', RIGHT(LocalName , LEN( LocalName ) - 1)) - 1 END)) AS [FirstName]
,(REPLACE(SUBSTRING(LocalName,CHARINDEX(' ',LocalName)+1,(((LEN(LocalName))-CHARINDEX('\', REVERSE(LocalName)))-CHARINDEX(' ',LocalName))),' ','')) AS [LastName]
,(CASE WHEN CHARINDEX('\', LocalName) > 0 THEN CONCAT(SUBSTRING(LocalName, CHARINDEX('\', LocalName) + 1, len(LocalName)), ' ', LEFT((RIGHT(LocalName, LEN(LocalName) - 1)),CHARINDEX('\',(RIGHT(LocalName, LEN(LocalName) - 1))) - 1)) ELSE RIGHT(LocalName, LEN(LocalName) - 1) END) AS [LocalName]
,(CASE WHEN CHARINDEX('\', EnglishName) > 0 THEN CONCAT(SUBSTRING(EnglishName, CHARINDEX('\', EnglishName) + 1, len(EnglishName)), ' ', LEFT((RIGHT(EnglishName, LEN(EnglishName) - 1)), CHARINDEX('\', (RIGHT(EnglishName, LEN(EnglishName) - 1))) - 1)) ELSE RIGHT(EnglishName, LEN(EnglishName) - 1) END) AS [EnglishName]
, [DoctorCategoryGroup], [Specialty],(select RIGHT( DNSYSCONFIG.LocalName , LEN( DNSYSCONFIG.LocalName ) - 1) from [10.1.1.117].[DNHOS].[dbo].DNSYSCONFIG where CtrlCode  ='42197' and Code = Specialty ) AS [SpecialtyName]
, [UserCode], [CertifyPublicNo], [ComposeDept], [Clinic], Case when Gender = '1' THEN 'F' ELSE 'M' END AS Gender, [Inactive]
FROM [10.1.1.117].[DNHOS].[dbo].[HNDOCTOR_MASTER]
WHERE len(Doctor) > '1' AND LocalName NOT LIKE '%\%' AND LocalName NOT LIKE '%คณะ%'
GO



USE [HOC]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

USE [HOC]
GO
/****** Object:  View [dbo].[HN_PAT_INFO]    Script Date: 7/11/2568 10:58:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[HN_PAT_INFO] AS
WITH MainTable AS (
SELECT
        HNM.[VisitDate],
        HNM.[VN],
        HNM.[DefaultRightCode] AS [RightCode],
        HNM.[HN],
        HNM.[VisitCode],
        (SELECT TOP 1 [LocalName]
         FROM [10.1.1.117].[DNHOS].[dbo].[DNSYSCONFIG]
         WHERE Code = HNM.[VisitCode] AND CtrlCode = '42260') AS VisitCodeName,
        HNINF.[BirthDateTime],
        (SELECT MAX(CASE WHEN IDCardType = '1' THEN RefNo END)
         FROM [10.1.1.117].[DNHOS].[dbo].HNPAT_REF
         WHERE IDCardType = '1' AND HN = HNINF.HN
         GROUP BY HN) AS IDcard,
        (SELECT MAX(CASE WHEN IDCardType = '5' THEN RefNo END)
         FROM [10.1.1.117].[DNHOS].[dbo].HNPAT_REF
         WHERE IDCardType = '5' AND HN = HNINF.HN
         GROUP BY HN) AS Passport,
        (SELECT RefNoDB.RefNo
         FROM (
             SELECT TOP 1 MIN(RefNoType) AS RefNoType, RefNo, HN
             FROM [10.1.1.117].[DNHOS].[dbo].HNPAT_REF
             WHERE RefNo IS NOT NULL AND HN = HNINF.HN
             GROUP BY RefNoType, RefNo, HN
         ) AS RefNoDB
         WHERE RefNo IS NOT NULL
         GROUP BY RefNo) AS CardETC,
        HNM.[NationalityCode],
        CASE WHEN HNINF.Gender = '1' THEN 'F'
             WHEN HNINF.Gender = '2' THEN 'M'
             ELSE '-' END AS Gender,
        CASE
            WHEN (SELECT RIGHT(LocalName, LEN(LocalName) - 1)
                  FROM [10.1.1.117].[DNHOS].[dbo].DNSYSCONFIG
                  WHERE CtrlCode = '10241' AND InitialNameCode = CODE) IS NOT NULL
            THEN (SELECT RIGHT(LocalName, LEN(LocalName) - 1)
                  FROM [10.1.1.117].[DNHOS].[dbo].DNSYSCONFIG
                  WHERE CtrlCode = '10241' AND InitialNameCode = CODE)
            ELSE CASE
                WHEN DATEDIFF(YEAR, HNINF.BirthDateTime, GETDATE()) < 15
                THEN CASE WHEN HNINF.Gender = '1' THEN 'เด็กหญิง' ELSE 'เด็กชาย' END
                ELSE CASE WHEN HNINF.Gender = '1'
                          THEN CASE WHEN HNINF.MaritalStatus = '1' THEN 'นางสาว' ELSE 'นาง' END
                          ELSE 'นาย'
                     END
            END
        END AS InitialName,
        HNPATN.[FirstName],
        HNPATN.[LastName]
    FROM [10.1.1.117].[DNHOS].[dbo].[HNOPD_MASTER] HNM
    LEFT JOIN [10.1.1.117].[DNHOS].[dbo].[HNPAT_NAME] HNPATN
        ON HNPATN.[HN] = HNM.[HN]
    LEFT JOIN [10.1.1.117].[DNHOS].[dbo].[HNPAT_INFO] HNINF
        ON HNINF.[HN] = HNM.[HN]
    WHERE CAST(HNM.[VisitDate] AS DATE) = CAST(GETDATE() AS DATE)
      AND HNPATN.SuffixSmall = '0'
),
LatestPrescrip AS (
    SELECT
        [VN],
        [VisitDate],
        [PrescriptionNo],
        [Doctor],
        [Clinic],
        ROW_NUMBER() OVER (
            PARTITION BY [VN]
            ORDER BY [PrescriptionNo] DESC
        ) AS rn
    FROM [10.1.1.117].[DNHOS].[dbo].[HNOPD_PRESCRIP]
    WHERE CAST([VisitDate] AS DATE) = CAST(GETDATE() AS DATE)
)

SELECT
    mt.*,
    lp.[PrescriptionNo],
    lp.[Doctor],
    lp.[Clinic]
    
FROM MainTable mt
LEFT JOIN LatestPrescrip lp
    ON mt.VN = lp.VN
   AND lp.rn = 1
GO


USE [HOC]
GO
/****** Object:  View [dbo].[STOCK_LIST]    Script Date: 13/1/2569 17:58:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[STOCK_LIST] AS

WITH MAINTABLE AS (
SELECT SMHP.[StockCode]
	--,SM.[EnglishName]
	--,SM.[LocalName]
	,CASE 
		WHEN SM.[EnglishName] IS NOT NULL THEN SM.[EnglishName]
		ELSE SM.[LocalName]
	END AS [Name]
	,SMHP.[SKMasterFixSalesPriceType]
	,SMHP.[UnitPrice1]
FROM [10.1.1.217].[DNStock].[dbo].[STOCKMASTER_HOSPITALSPRICE] SMHP
LEFT JOIN [10.1.1.217].[DNStock].[dbo].[STOCKMASTER] SM ON SM.StockCode = SMHP.StockCode AND Inactive = 0 
Where SMHP.[EffDateTimeTo] IS NULL ) 

SELECT [StockCode]
	--,[EnglishName]
	--,[LocalName]
	,[Name]
	,[SKMasterFixSalesPriceType]
	,[UnitPrice1]
FROM MAINTABLE 
WHERE [Name] IS NOT NULL
GO