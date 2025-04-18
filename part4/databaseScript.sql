USE [grocery]
GO
/****** Object:  Table [dbo].[orderItems]    Script Date: 08/04/2025 16:12:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orderItems](
	[OrderItemId] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
 CONSTRAINT [PK_orderItems] PRIMARY KEY CLUSTERED 
(
	[OrderItemId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 08/04/2025 16:12:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[OrderId] [int] IDENTITY(1,1) NOT NULL,
	[SupplierId] [int] NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[CreatedDate] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_orders] PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products]    Script Date: 08/04/2025 16:12:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[ProductId] [int] IDENTITY(1,1) NOT NULL,
	[SupplierId] [int] NOT NULL,
	[ProductName] [nvarchar](max) NOT NULL,
	[UnitPrice] [float] NOT NULL,
	[MinOrderQuantity] [int] NOT NULL,
 CONSTRAINT [PK_products] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[suppliers]    Script Date: 08/04/2025 16:12:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[suppliers](
	[SupplierId] [int] IDENTITY(1,1) NOT NULL,
	[ContactName] [nvarchar](max) NOT NULL,
	[CompanyName] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_suppliers] PRIMARY KEY CLUSTERED 
(
	[SupplierId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 08/04/2025 16:12:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[orderItems] ON 

INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (10, 10, 5, 40)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (11, 11, 3, 10)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (12, 11, 4, 30)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (13, 12, 1, 20)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (14, 13, 2, 20)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (15, 14, 6, 30)
INSERT [dbo].[orderItems] ([OrderItemId], [OrderId], [ProductId], [Quantity]) VALUES (16, 15, 2, 20)
SET IDENTITY_INSERT [dbo].[orderItems] OFF
GO
SET IDENTITY_INSERT [dbo].[orders] ON 

INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (10, 6, N'COMPLETED', CAST(N'2025-04-08T11:04:29.5970000' AS DateTime2))
INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (11, 6, N'PENDING', CAST(N'2025-04-08T11:04:45.5910000' AS DateTime2))
INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (12, 2, N'PENDING', CAST(N'2025-04-08T11:05:02.2360000' AS DateTime2))
INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (13, 3, N'PENDING', CAST(N'2025-04-08T11:05:17.3240000' AS DateTime2))
INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (14, 6, N'PENDING', CAST(N'2025-04-08T12:18:37.6980000' AS DateTime2))
INSERT [dbo].[orders] ([OrderId], [SupplierId], [Status], [CreatedDate]) VALUES (15, 3, N'PENDING', CAST(N'2025-04-08T12:21:19.7450000' AS DateTime2))
SET IDENTITY_INSERT [dbo].[orders] OFF
GO
SET IDENTITY_INSERT [dbo].[products] ON 

INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (1, 2, N'חלב', 5.5, 20)
INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (2, 3, N'חלב', 6.5, 20)
INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (3, 6, N'ופלים', 10.9, 10)
INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (4, 6, N'עוגיות', 12.5, 30)
INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (5, 6, N'ביסקוויטים', 18, 40)
INSERT [dbo].[products] ([ProductId], [SupplierId], [ProductName], [UnitPrice], [MinOrderQuantity]) VALUES (6, 6, N'שוגי', 20.49, 30)
SET IDENTITY_INSERT [dbo].[products] OFF
GO
SET IDENTITY_INSERT [dbo].[suppliers] ON 

INSERT [dbo].[suppliers] ([SupplierId], [ContactName], [CompanyName], [Phone], [UserId]) VALUES (2, N'אריה', N'תנובה', N'0527645315', 3)
INSERT [dbo].[suppliers] ([SupplierId], [ContactName], [CompanyName], [Phone], [UserId]) VALUES (3, N'משה', N'שטראוס', N'0526666666', 24)
INSERT [dbo].[suppliers] ([SupplierId], [ContactName], [CompanyName], [Phone], [UserId]) VALUES (5, N'שלום', N'משק ל.ס.ר', N'0528585858', 29)
INSERT [dbo].[suppliers] ([SupplierId], [ContactName], [CompanyName], [Phone], [UserId]) VALUES (6, N'גדי', N'עלמה', N'0524252425', 30)
INSERT [dbo].[suppliers] ([SupplierId], [ContactName], [CompanyName], [Phone], [UserId]) VALUES (7, N'אלי', N'זוגלובק', N'0521212121', 31)
SET IDENTITY_INSERT [dbo].[suppliers] OFF
GO
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (3, N'SUPPLIER', N'AQAAAAIAAYagAAAAEJBBVRi113HxLxleutT44i25h/nVKNVuMR391R0paJxsfWTMiiOJk4RzaSC9nh/I5w==', N'bcubc@bcuieb.bvu')
INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (23, N'Admin', N'AQAAAAIAAYagAAAAEMdngwKhqxMdjKtkubQ2hcEx3Maose8uw01pyQZFW1XNSsHI/Fhr0avc9NNNcH5bkw==', N'g111@g.g')
INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (24, N'SUPPLIER', N'AQAAAAIAAYagAAAAELV7CGckqsRkxAodmStdLifLD5N3+MpyX9ZedivIc1malPRQj1UPZA9rCLux3Fwrmw==', N'g7070@gy.fit')
INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (29, N'SUPPLIER', N'AQAAAAIAAYagAAAAEKEE1utdm2xWjohxgHW/Sly4VxRjriPI8GYWh9BkaSng4QM6vkNxX5C1+bmb/pAYZA==', N'g12@gy.fit')
INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (30, N'SUPPLIER', N'AQAAAAIAAYagAAAAEAEWrYrhqhl+f2PezCt0CIzcO0XdKLftmaT3Unc8g0Hj4G7tSGasgG5EB5tzLim2gw==', N'g3333@gy.fit')
INSERT [dbo].[users] ([UserId], [Role], [Password], [Email]) VALUES (31, N'SUPPLIER', N'AQAAAAIAAYagAAAAEBLKQYXebpI8FUNhCIowd7SgECdDhhOslUxqxWI0VWn/i3FLiFrp8RfdtEzzPetW8w==', N'g33343@gy.fit')
SET IDENTITY_INSERT [dbo].[users] OFF
GO
ALTER TABLE [dbo].[orderItems]  WITH CHECK ADD  CONSTRAINT [FK_orderItems_orders_OrderId] FOREIGN KEY([OrderId])
REFERENCES [dbo].[orders] ([OrderId])
GO
ALTER TABLE [dbo].[orderItems] CHECK CONSTRAINT [FK_orderItems_orders_OrderId]
GO
ALTER TABLE [dbo].[orderItems]  WITH CHECK ADD  CONSTRAINT [FK_orderItems_products_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[products] ([ProductId])
GO
ALTER TABLE [dbo].[orderItems] CHECK CONSTRAINT [FK_orderItems_products_ProductId]
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [FK_orders_suppliers_SupplierId] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[suppliers] ([SupplierId])
GO
ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [FK_orders_suppliers_SupplierId]
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD  CONSTRAINT [FK_products_suppliers_SupplierId] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[suppliers] ([SupplierId])
GO
ALTER TABLE [dbo].[products] CHECK CONSTRAINT [FK_products_suppliers_SupplierId]
GO
ALTER TABLE [dbo].[suppliers]  WITH CHECK ADD  CONSTRAINT [FK_suppliers_users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[users] ([UserId])
GO
ALTER TABLE [dbo].[suppliers] CHECK CONSTRAINT [FK_suppliers_users_UserId]
GO
