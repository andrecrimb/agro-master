import { body, param } from 'express-validator'
import prisma from '../client'
import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'
import greenhouseController from '../controllers/greenhouse'

const router = express.Router()

router.get('/greenhouses', isAuthenticated, greenhouseController.getGreenhouses)
router.get(
  '/greenhouses/:greenhouseId',
  isAuthenticated,
  param('greenhouseId').exists().toInt(),
  greenhouseController.getGreenhouse
)

router.post(
  '/greenhouses',
  isAuthSuperUser,
  [
    body('type').trim().notEmpty(),
    body('label')
      .trim()
      .notEmpty()
      .custom((val, { req }) => {
        return prisma.greenhouse
          .findFirst({
            where: { label: val, ownerPropertyId: req.body.ownerPropertyId }
          })
          .then(gh => {
            if (gh) return Promise.reject('greenhouse_already_exists')
          })
      }),
    body('ownerPropertyId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.ownerProperty.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_property')
        })
      })
  ],
  greenhouseController.addGreenhouse
)

router.patch(
  '/greenhouses/:greenhouseId',
  isAuthSuperUser,
  [
    body('label').trim().notEmpty(),
    body('type').trim().notEmpty(),
    param('greenhouseId').exists().toInt(),
    body('ownerPropertyId')
      .exists()
      .toInt()
      .custom(value => {
        return prisma.ownerProperty.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_property')
        })
      })
  ],
  greenhouseController.editGreenhouse
)

router.delete(
  '/greenhouses/:greenhouseId',
  isAuthSuperUser,
  param('greenhouseId').exists().toInt(),
  greenhouseController.deleteGreenhouse
)

router.post(
  '/greenhouses/:greenhouseId/benches',
  isAuthSuperUser,
  [
    body('label')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return prisma.seedlingBench
          .findFirst({ where: { label: value, greenhouseId: +`${req.params?.greenhouseId}` } })
          .then(bench => {
            if (bench) return Promise.reject('bench_duplicated')
          })
      }),
    body('quantity').trim().toFloat().isFloat({ min: 1 }),
    body('lastPlantingDate').trim().notEmpty().toDate(),
    body('firstPaymentDate').trim().notEmpty().toDate(),
    param('greenhouseId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.greenhouse.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_greenhouse')
        })
      }),
    body('rootstockId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.rootstock.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_rootstock')
        })
      }),
    body('userId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.user.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_user')
        })
      })
  ],
  greenhouseController.addBench
)

router.put(
  '/greenhouses/:greenhouseId/benches/:benchId',
  isAuthSuperUser,
  [
    body('label')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return prisma.seedlingBench
          .findFirst({ where: { label: value, greenhouseId: +`${req.params?.greenhouseId}` } })
          .then(bench => {
            if (bench && bench.id !== +req.params?.benchId) {
              return Promise.reject('bench_duplicated')
            }
          })
      }),
    body('quantity').toInt().isInt({ min: 1 }),
    body('lastPlantingDate').trim().notEmpty().toDate(),
    body('firstPaymentDate').trim().notEmpty().toDate(),
    param('benchId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.seedlingBench.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_bench')
        })
      }),
    param('greenhouseId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.greenhouse.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_greenhouse')
        })
      }),
    body('rootstockId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.rootstock.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_rootstock')
        })
      }),
    body('userId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.user.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_user')
        })
      })
  ],
  greenhouseController.editBench
)

router.delete(
  '/greenhouses/:greenhouseId/benches/:benchId',
  isAuthSuperUser,
  [param('greenhouseId').exists().toInt(), param('benchId').exists().toInt()],
  greenhouseController.deleteBench
)

export default router
